import { Module } from '@nestjs/common';
import { FirebaseStrategy } from './auth.service';

@Module({
  providers: [FirebaseStrategy],
  exports: [FirebaseStrategy]
})
export class AuthModule {}
