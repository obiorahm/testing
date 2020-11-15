import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
  imports: [UserModule]
})
export class MessageModule {}
