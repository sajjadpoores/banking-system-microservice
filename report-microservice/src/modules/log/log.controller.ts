import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogService } from './log.service';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';
import { DepositDoneEventPayloadDto } from './dto/deposit-done-event-payload.dto';

@Controller('log')
export class logController {
  constructor(private readonly _logService: LogService) {}

  @MessagePattern('log.transfered')
  async transferDone(
    @Payload() payload: TransferDoneEventPayloadDto,
  ): Promise<boolean> {
    return this._logService.transfer(payload);
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
