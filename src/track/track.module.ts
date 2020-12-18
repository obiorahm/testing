import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  imports: [
    UserModule
  ]
})
export class TrackModule {}
