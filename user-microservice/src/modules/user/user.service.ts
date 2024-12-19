import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-body.dto';
import { UserRepository } from 'src/shared/repository/account.repository';
import * as bcrypt from 'bcrypt';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { CreateUserResponseDto } from './dto/craete-user-response.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user-body.dto';
import { LoginUserResponseDto } from './dto/login-user-resopnse.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async createUser(
    payload: CreateUserDto,
  ): Promise<ResponseModel<CreateUserResponseDto>> {
    const { userId, password, name } = payload;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this._userRepository.create({
      userId,
      password: hashedPassword,
      name,
    });

    try {
      const savedUser = await this._userRepository.save(user);
      return {
        status: ReponseStatus.SUCCESS,
        message: 'USer created successfully',
        data: {
          name: savedUser.name,
          userId: savedUser.userId,
        },
      };
    } catch (error) {
      if (error.code === '23505') {
        return {
          status: ReponseStatus.FAILED,
          message: 'User has already been registered!',
          data: null,
        };
      } else {
        console.error(error);
        return {
          status: ReponseStatus.FAILED,
          message: 'Internal server error',
          data: error.message,
        };
      }
    }
  }

  async login(
    payload: LoginUserDto,
  ): Promise<ResponseModel<LoginUserResponseDto>> {
    const { userId, password } = payload;
    const user = await this._userRepository.findOne({ where: { userId } });

    if (!user) {
      return {
        status: ReponseStatus.FAILED,
        message: 'Invalid credentials',
        data: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: ReponseStatus.FAILED,
        message: 'Invalid credentials',
        data: null,
      };
    }

    const payloadJwt = { sub: user.id, userId: user.userId };
    const accessToken = this._jwtService.sign(payloadJwt, { expiresIn: '15m' });
    const refreshToken = this._jwtService.sign(payloadJwt, { expiresIn: '7d' });

    return {
      status: ReponseStatus.SUCCESS,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(
    token: string,
  ): Promise<ResponseModel<LoginUserResponseDto>> {
    try {
      console.log(token);
      const payload = this._jwtService.verify(token);
      const user = await this._userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        return {
          status: ReponseStatus.FAILED,
          message: 'Invalid refresh token',
          data: null,
        };
      }

      const newAccessToken = this._jwtService.sign(
        { sub: user.id, userId: user.userId },
        { expiresIn: '15m' },
      );
      const newRefreshToken = this._jwtService.sign(
        { sub: user.id, userId: user.userId },
        { expiresIn: '7d' },
      );

      return {
        status: ReponseStatus.SUCCESS,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: ReponseStatus.FAILED,
        message: 'Invalid refresh token',
        data: null,
      };
    }
  }
}
