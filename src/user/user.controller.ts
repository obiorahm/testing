import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('firebase'))
  async index(@Request() req): Promise<User> {
    const user = await this.userService.getUser(req.user.uid);
    return user;
  }

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createUser(@Request() req, @Body() body): Promise<any> {
    const user = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.accountId = user.accountId;
    const result = await this.userService.createUser(params);
    return result;
  }

}
