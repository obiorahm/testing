import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Pair } from './pair.models';
import { PairService } from './pair.service';

@Controller('pair')
export class PairController {

  constructor(
    private readonly pairService: PairService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createPair(@Request() req, @Body() body): Promise<Pair> {
    const user = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.accountId = user.accountId;
    const result = await this.pairService.createPair(params);
    return result;
  }

}
