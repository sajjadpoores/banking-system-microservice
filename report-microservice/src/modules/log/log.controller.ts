import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogService } from './log.service';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';
import { DepositDoneEventPayloadDto } from './dto/deposit-done-event-payload.dto';
import { TransferStartedPayloadDto } from './dto/transfer-started-payload.dto';

@Controller('log')
export class logController {
  constructor(private readonly _logService: LogService) {}

  @MessagePattern('log.transferStarted')
  async transferStarted(
    @Payload() payload: TransferStartedPayloadDto,
  ): Promise<boolean> {
    return this._logService.transferStarted(payload);
  }

  @MessagePattern('log.transferFinished')
  async transferDone(
    @Payload() payload: TransferDoneEventPayloadDto,
  ): Promise<boolean> {
    return this._logService.transferFinished(payload);
  }

  @MessagePattern('log.deposit')
  async depositDone(
    @Payload() payload: DepositDoneEventPayloadDto,
  ): Promise<boolean> {
    return this._logService.deposit(payload);
  }

  @MessagePattern('log.gift')
  async giftDone(
    @Payload() payload: DepositDoneEventPayloadDto,
  ): Promise<boolean> {
    return this._logService.gift(payload);
  }
}
