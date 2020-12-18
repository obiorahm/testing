import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { ThreadService } from './thread/thread.service';
import { ThreadModule } from './thread/thread.module';
import { PairModule } from './pair/pair.module';
import { PromptModule } from './prompt/prompt.module';
import { TrackService } from './track/track.service';
import { TrackController } from './track/track.controller';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential: "./config/firebaseCredentials.json",
    }),
    DbModule,
    UserModule,
    AuthModule,
    MessageModule,
    ThreadModule,
    PairModule,
    PromptModule,
    TrackModule,
  ],
  controllers: [AppController, TrackController],
  providers: [
    AppService,
    ThreadService,
    TrackService,
  ],
})
export class AppModule {}
