import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user-body.dto';
import { LoginUserDto } from './dto/login-user-body.dto';
import { RefreshTokenBodyDto } from './dto/refresh-token-body.dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @MessagePattern('user.create')
  async createUser(@Payload() payload: CreateUserDto) {
    return this._userService.createUser(payload);
  }

  @MessagePattern('user.login')
  async login(@Payload() payload: LoginUserDto) {
    return this._userService.login(payload);
  }

  @MessagePattern('user.refresh-token')
  async refreshToken(@Payload() payload: RefreshTokenBodyDto) {
    return this._userService.refreshToken(payload.refreshToken);
  }
}
