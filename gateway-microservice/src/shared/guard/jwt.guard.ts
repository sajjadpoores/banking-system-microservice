import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorator/is-public.decorator';
import { REQUIRE_ACCOUNT_ACCESS_KEY } from '../decorator/require-account-access.decorator';
import Redis from 'ioredis';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const accessAccountKey = this.reflector.getAllAndOverride<string>(
      REQUIRE_ACCOUNT_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      return false;
    }

    const token = authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      if (accessAccountKey) {
        const accessAccount = this.extractAccountNumberFromRequest(
          request,
          accessAccountKey,
        );
        if (!accessAccount) {
          throw new ForbiddenException('Account number is missing.');
        }

        const userId = decoded.userId;
        const isAccountValid = await this.redisClient.hexists(
          `user:${userId}:accounts`,
          accessAccount,
        );
        if (!isAccountValid) {
          throw new ForbiddenException(
            'You do not have access to this account.',
          );
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private extractAccountNumberFromRequest(
    request: any,
    accessAccountKey: string,
  ): string | null {
    return (
      request.params?.[accessAccountKey] ||
      request.body?.[accessAccountKey] ||
      request.query?.[accessAccountKey] ||
      null
    );
  }
}
