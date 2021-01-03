import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { UserModule } from 'src/user/user.module';
import { ThreadModule } from 'src/thread/thread.module';
import { MessageModule } from 'src/message/message.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  providers: [PromptService],
  controllers: [PromptController],
  imports: [
    UserModule,
    ThreadModule,
    MessageModule,
    TrackModule
  ]
})
export class PromptModule {}
