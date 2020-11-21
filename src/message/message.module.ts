import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UserModule } from 'src/user/user.module';
import { ThreadModule } from 'src/thread/thread.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
  imports: [UserModule, ThreadModule]
})
export class MessageModule {}
