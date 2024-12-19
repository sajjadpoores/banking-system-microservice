import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACCOUNT_ACCESS_KEY = 'requireAccountAccess';
export const RequireAccountAccess = (accessAccountKey: string) =>
  SetMetadata(REQUIRE_ACCOUNT_ACCESS_KEY, accessAccountKey);
