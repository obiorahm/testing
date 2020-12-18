import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrackService } from './track.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.models';
import { Track } from './track.models';

@Controller('track')
export class TrackController {

  constructor(
    private readonly trackService: TrackService,
    private readonly userService: UserService
  ) {}

  @Get()
  @UseGuards(AuthGuard('firebase'))
  async getAccountTracks(@Request() req): Promise<Array<Track>> {
    const user: User = await this.userService.getUser(req.user.uid);
    const result = await this.trackService.getTracks(user.accountId);
    return result;
  }
  
  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createNewTrack(@Request() req, @Body() body): Promise<Track> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    // Super admin can create tracks for anyone
    if (!user.isSuperAdmin && user.accountId !== params.accountId) {
      return;
    }
    // TODO: allow super admin to choose accountId
    // if (!user.isSuperAdmin) {
    //   params.accountId = user.accountId;
    // }
    params.accountId = user.accountId;
    params.createdById = user.id;
    const result = await this.trackService.createTrack(params);
    return result;
  }

}
