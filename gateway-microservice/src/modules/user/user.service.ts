import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-body.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateUserResponseDto } from './dto/craete-user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginBodyDto } from './dto/login-body.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject('user_broker')
    private readonly _rabbitmqClient: ClientProxy,
  ) {}

  async createUser(payload: CreateUserDto) {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<CreateUserResponseDto>>(
        'user.create',
        payload,
      ),
    );
  }

  async login(payload: LoginBodyDto): Promise<ResponseModel<LoginResponseDto>> {
    const response = await firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<LoginResponseDto>>(
        'user.login',
        payload,
      ),
    );

    if (response.status === ReponseStatus.FAILED) {
      throw new UnauthorizedException(response.message);
    }

    return response;
  }

  async refreshToken(token: string): Promise<ResponseModel<LoginResponseDto>> {
    const response = await firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<LoginResponseDto>>(
        'user.refresh-token',
        { refreshToken: token },
      ),
    );

    if (response.status === ReponseStatus.FAILED) {
      throw new UnauthorizedException(response.message);
    }

    return response;
  }
}
