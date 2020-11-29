import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from 'src/thread/thread.service';
import { User } from 'src/user/user.models';
import { UserService } from 'src/user/user.service';
import { Prompt } from './prompt.models';
import { PromptService } from './prompt.service';

@Controller('prompt')
export class PromptController {

  constructor(
    private readonly promptService: PromptService,
    private readonly userService: UserService,
    private readonly threadService: ThreadService
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('firebase'))
  async createNewPrompt(@Request() req, @Body() body): Promise<Prompt> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    // Super admin can create prompts for anyone
    if (!user.isSuperAdmin && user.accountId !== params.accountId) {
      return;
    }
    // Make sure thread contains users
    const thread = await this.threadService.getThread(params.threadId);
    for (let userId of params.userIds) {
      if (!thread.userIds.includes(userId)) {
        return;
      }
    }
    const result = await this.promptService.createPrompt(params);
    return result;
  }

  @Post(':promptId/response')
  @UseGuards(AuthGuard('firebase'))
  async createPromptResponse(@Request() req, @Body() body, @Param() params): Promise<Prompt> {
    const user: User = await this.userService.getUser(req.user.uid);
    const data: any = body;
    const prompt: Prompt = await this.promptService.getPrompt(params.promptId);
    if (!prompt.userIds.includes(user.id)) {
      return;
    }
    const result = await this.promptService.addPromptResponse(
      prompt,
      user,
      body.response
    );
    return result;
  }

}
