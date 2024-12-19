import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginBodyDto } from './dto/login-body.dto';
import { Public } from 'src/shared/decorator/is-public.decorator';
import { CreateUserResponseDto } from './dto/craete-user-response.dto';
import { RefreshTokenBodyDto } from './dto/refresh-token-body';

@ApiTags('User')
@Controller('user')
@Public()
@ApiExtraModels(ResponseModel, CreateUserResponseDto, LoginResponseDto) // Inform Swagger about these models
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    status: 201,
    description: 'User registered successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CreateUserResponseDto) }, // Reference the CreateUserResponseDto
          },
        },
      ],
    },
  })
  async createUser(
    @Body() payload: CreateUserDto,
  ): Promise<ResponseModel<CreateUserResponseDto>> {
    return this._userService.createUser(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    status: 200,
    description: 'User logged in successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseDto) }, // Reference the LoginResponseDto
          },
        },
      ],
    },
  })
  async login(
    @Body() payload: LoginBodyDto,
  ): Promise<ResponseModel<LoginResponseDto>> {
    return this._userService.login(payload);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseDto) }, // Reference the LoginResponseDto
          },
        },
      ],
    },
  })
  async refreshToken(
    @Body() body: RefreshTokenBodyDto,
  ): Promise<ResponseModel<LoginResponseDto>> {
    return this._userService.refreshToken(body.refreshToken);
  }
}
