import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from 'src/thread/thread.service';
import { User } from 'src/user/user.models';
import { UserService } from 'src/user/user.service';
import { Prompt, PromptResponse } from './prompt.models';
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
    // If not super admin force account to user's account
    if (!user.isSuperAdmin) {
      params.accountId = user.accountId;
    }
    params.createdById = user.id;
    const result = await this.promptService.createPrompt(params);
    return result;
  }

  @Post('send')
  @UseGuards(AuthGuard('firebase'))
  async sendNewPrompt(@Request() req, @Body() body): Promise<PromptResponse> {
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
    // Check prompt ownership
    const prompt: Prompt = await this.promptService.getPrompt(params.promptId);
    if (!user.isSuperAdmin && prompt.accountId && prompt.accountId !== user.accountId) {
      return;
    }
    const result = await this.promptService.sendPrompt(prompt, user, params);
    return result;
  }

  @Post(':promptResponseId/response')
  @UseGuards(AuthGuard('firebase'))
  async createPromptResponse(@Request() req, @Body() body, @Param() params): Promise<PromptResponse> {
    const user: User = await this.userService.getUser(req.user.uid);
    const data: any = body;
    const promptResponse: PromptResponse = await this.promptService.getPromptResponse(
      params.promptResponseId
    );
    if (promptResponse.userId !== user.id) {
      return;
    }
    const result = await this.promptService.addPromptResponse(
      promptResponse,
      user,
      data.response
    );
    return result;
  }

}
