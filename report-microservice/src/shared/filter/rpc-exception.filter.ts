import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ReponseStatus } from '../enum/response-status.enum';
@Catch()
export class RpcExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToRpc();
    const data = ctx.getData();

    let status: number;
    let message: string;

    if (exception instanceof RpcException) {
      const error = exception.getError();
      status = error['status'] || 500;
      message = error['message'] || 'An error occurred';
    } else {
      status = 500;
      message = 'Internal server error';
    }

    // Log the error details
    this.logger.error(
      `Status: ${status} Error: ${message} Data: ${JSON.stringify(data)}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorResponse = {
      status: ReponseStatus.FAILED,
      message: message,
      data: null,
    };

    return errorResponse;
  }
}
