import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Message } from './message.models';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createMessage(@Request() req, @Body() body): Promise<Message> {
    const user = await this.userService.getUser(req.user.uid);
    const params: any = body;
    params.accountId = user.accountId;
    const result = await this.messageService.createMessage(params);
    return result;
  }

}
