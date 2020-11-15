import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService],
  imports: [UserModule]
})
export class ThreadModule {}
