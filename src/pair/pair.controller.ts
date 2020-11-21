import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.models';
import { UserService } from 'src/user/user.service';
import { Pair } from './pair.models';
import { PairService } from './pair.service';

@Controller('pair')
export class PairController {

  constructor(
    private readonly pairService: PairService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('firebase'))
  async getUserPairs(@Request() req): Promise<Array<Pair>> {
    const pairs: Array<Pair> = await this.pairService.getPairsByUser(req.user.uid);
    return pairs;
  }
  
  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createPair(@Request() req, @Body() body): Promise<Pair> {
    const user: User = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.accountId = user.accountId;
    const result = await this.pairService.createPair(params);
    return result;
  }

}
