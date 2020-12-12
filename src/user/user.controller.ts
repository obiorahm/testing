import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
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

  @Get(':userId')
  @UseGuards(AuthGuard('firebase'))
  async getById(@Request() req, @Param() params): Promise<User> {
    const loggedInUser = await this.userService.getUser(req.user.uid);
    const user = await this.userService.getUser(params.userId);
    if (!loggedInUser.isSuperAdmin && user.accountId !== loggedInUser.accountId) {
      return;
    }
    return user;
  }

  // Create firebase user and pairup user
  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createUser(@Request() req, @Body() body): Promise<any> {
    const user = await this.userService.getUser(req.user.uid);
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    if (!user.isSuperAdmin) {
      params.accountId = user.accountId;
      // Only super admins can create super admins
      if (!user.isSuperAdmin) {
        params.isSuperAdmin = false;
      }
    }
    const result = await this.userService.createUser(params);
    return result;
  }

  // Existing firebase user register for pairup
  @Post('register')
  @UseGuards(AuthGuard('firebase'))
  async registerUser(@Request() req, @Body() body): Promise<any> {
    const params: any = body;
    if (!params.password || params.password !== params.confirmPassword) {
      return;
    }
    params.firebaseUserId = req.user.uid;
    params.isAdmin = false;
    const result = await this.userService.createUser(params);
    return result;
  }

  @Post(':userId/push_token')
  @UseGuards(AuthGuard('firebase'))
  async startPushNotifications(@Request() req, @Param() params, @Body() body: any): Promise<User> {
    if (req.user.uid != params.userId) {
      return;
    }
    // Update user
    const userData = {
      pushToken: body.pushToken
    }
    const user = await this.userService.updateUser(params.userId, userData);
    return user;
  }

  @Post(':userId/avatar')
  @UseGuards(AuthGuard('firebase'))
  async changeAvatar(@Request() req, @Param() params, @Body() body: any): Promise<User> {
    if (req.user.uid != params.userId) {
      return;
    }
    // Update user
    const userData = {
      avatarIndex: body.avatarIndex
    }
    const user = await this.userService.updateUser(params.userId, userData);
    return user;
  }

}
