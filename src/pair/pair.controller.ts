import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getRepository } from 'fireorm';
import { User } from 'src/user/user.models';
import { UserService } from 'src/user/user.service';
import { Pair, PairRequest } from './pair.models';
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

  @Get('list')
  @UseGuards(AuthGuard('firebase'))
  async getPairsList(@Request() req): Promise<Array<Pair>> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params = {
      accountId: user.accountId
    }
    // TODO: allow superAdmin to pass in accountId
    const pairs: Array<Pair> = await this.pairService.getPairsByAccount(params);
    return pairs;
  }
  
  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createPair(@Request() req, @Body() body): Promise<Pair> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    // Super admin can create pairs for anyone
    if (!user.isSuperAdmin && user.accountId !== params.accountId) {
      return;
    }
    // If not super admin force account to user's account
    if (!user.isSuperAdmin || !params.accountId) {
      params.accountId = user.accountId;
    }
    params.createdById = user.id;
    const result = await this.pairService.createPair(params);
    return result;
  }

  @Post('request/create')
  @UseGuards(AuthGuard('firebase'))
  async createPairRequest(@Request() req, @Body() body): Promise<PairRequest> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    // Super admin can create pair requests for anyone
    if (!user.isSuperAdmin && user.accountId !== params.accountId) {
      return;
    }
    // If not super admin force account to user's account
    if (!user.isSuperAdmin || !params.accountId) {
      params.accountId = user.accountId;
    }
    params.createdById = user.id;
    const result = await this.pairService.createPairRequest(params);
    return result;
  }

  @Post('request/accept')
  @UseGuards(AuthGuard('firebase'))
  async acceptPairRequest(@Request() req, @Body() body): Promise<Pair> {
    const user: User = await this.userService.getUser(req.user.uid);
    const params: any = body;
    const pairRequestCollection = getRepository(PairRequest);
    const pairRequest: PairRequest = await pairRequestCollection.findById(
      params.pairRequestId
    );
    if (pairRequest.userId !== user.id) {
      return;
    }
    const result = await this.pairService.acceptPairRequest(pairRequest);
    return result;
  }

}
