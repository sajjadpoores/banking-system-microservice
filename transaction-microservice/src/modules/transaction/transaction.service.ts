import { Inject, Injectable } from '@nestjs/common';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransactionRepository } from 'src/shared/repository/transaction-repository';
import { Transaction } from 'src/shared/schema/transaction.schema';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { CounterRepository } from 'src/shared/repository/counter-repository';
import { ClientProxy } from '@nestjs/microservices';
import { TransferStartedPayloadDto } from './dto/transfer-started-payload.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly _transactionRepository: TransactionRepository,
    private readonly _counterRepository: CounterRepository,
    @Inject('report_broker')
    private readonly messageBrokerClient: ClientProxy,
  ) {}

  async transfer(
    payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    try {
      const transactionNumber =
        await this._counterRepository.getNextTransactionNumber();
      await this.messageBrokerClient.emit('log.transferStarted', {
        amount: payload.amount,
        description: payload.description,
        destinationAccountNumber: payload.destinationAccountNumber,
        sourceAccountNumber: payload.sourceAccountNumber,
        sourceUserId: payload.userId,
        transactionNumber,
      } as TransferStartedPayloadDto);

      const transaction = new Transaction();
      transaction.amount = payload.amount;
      transaction.date = new Date();
      transaction.description = payload.description;
      transaction.destinationAccountNumber = payload.destinationAccountNumber;
      transaction.sourceAccountNumber = payload.sourceAccountNumber;
      transaction.sourceUserId = payload.userId;
      transaction.transactionNumber = transactionNumber;

      await this._transactionRepository.create(transaction);

      return {
        status: ReponseStatus.SUCCESS,
        message: 'Transaction inserted',
        data: {
          transactionNumber: transaction.transactionNumber,
          transactionStatus: TransactionStatus.PENDING,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: ReponseStatus.FAILED,
        message: 'Transaction failed',
        data: null,
      };
    }
  }
}
