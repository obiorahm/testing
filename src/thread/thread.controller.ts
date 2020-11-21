import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Thread } from './thread.models';
import { ThreadService } from './thread.service';

@Controller('thread')
export class ThreadController {

  constructor(
    private readonly threadService: ThreadService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('firebase'))
  async index(@Request() req): Promise<Array<Thread>> {
    const threads = await this.threadService.getUserThreads(req.user.uid);
    return threads;
  }

  @Get(':threadId')
  @UseGuards(AuthGuard('firebase'))
  async getById(@Request() req, @Param() params): Promise<Thread> {
    const thread: Thread = await this.threadService.getThread(params.threadId);
    return thread;
  }

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createThread(@Request() req, @Body() body): Promise<Thread> {
    const user = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.accountId = user.accountId;
    const result = await this.threadService.createThread(params);
    return result;
  }

}
