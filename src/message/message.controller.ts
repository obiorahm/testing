import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Thread } from 'src/thread/thread.models';
import { ThreadService } from 'src/thread/thread.service';
import { UserService } from 'src/user/user.service';
import { Message } from './message.models';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly threadService: ThreadService,
  ) {}

  @Get('thread/:threadId')
  @UseGuards(AuthGuard('firebase'))
  async getByThread(@Request() req, @Param() params): Promise<Array<Message>> | null {
    const thread: Thread = await this.threadService.getThread(params.threadId);
    if (!thread || !thread.userIds.includes(req.user.uid)) {
      return;
    }
    const messages = await this.messageService.getThreadMessages(params.threadId);
    return messages;
  }

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createMessage(@Request() req, @Body() body): Promise<Message> {
    const user = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.senderId = user.id;
    params.accountId = user.accountId;
    const result = await this.messageService.createMessage(params);
    return result;
  }

}
