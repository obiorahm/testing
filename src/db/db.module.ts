import { Module, Global } from '@nestjs/common';
import { DbProvider } from './db';

@Global()
@Module({
  providers: [DbProvider],
  exports: [DbProvider]
})
export class DbModule {}
