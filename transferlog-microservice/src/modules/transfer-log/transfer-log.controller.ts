import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransferLogService } from './transfer-log.service';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';

@Controller('transfer-log')
export class TransferLogController {
  constructor(private readonly _transferLogService: TransferLogService) {}

  @MessagePattern('transfer.done')
  async transferDone(
    @Payload() payload: TransferDoneEventPayloadDto,
  ): Promise<boolean> {
    return this._transferLogService.transfer(payload);
  }
}
