import { Module } from '@nestjs/common';
import { PairService } from './pair.service';
import { PairController } from './pair.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PairController],
  providers: [PairService],
  exports: [PairService],
  imports: [UserModule]
})
export class PairModule {}
