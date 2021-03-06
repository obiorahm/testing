import { Body, Controller, Param, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Thread } from 'src/thread/thread.models';
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
    if (!user.isSuperAdmin || !params.accountId) {
      params.accountId = user.accountId;
    }
    params.createdById = user.id;
    const result = await this.promptService.createPrompt(params);
    return result;
  }

  @Post('edit/:promptId')
  @UseGuards(AuthGuard('firebase'))
  async editPrompt(@Request() req, @Body() body, @Param('promptId') promptId): Promise<Prompt> {
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    let params: any = body;
    params.id = promptId;
    // Super admin can create prompts for anyone
    if (!user.isSuperAdmin && user.accountId !== params.accountId) {
      return;
    }
    // If not super admin force account to user's account
    if (!user.isSuperAdmin || !params.accountId) {
      params.accountId = user.accountId;
    }
    params.editedById = user.id;
    const prompt: Prompt = await this.promptService.getPrompt(promptId);
    if (!prompt) {
      return;
    }
    if (!user.isSuperAdmin && user.accountId !== prompt.accountId) {
      return;
    }
    const result = await this.promptService.editPrompt(params);
    return result;
  }

  @Post('send')
  @UseGuards(AuthGuard('firebase'))
  async sendNewPrompt(@Request() req, @Body() body): Promise<any> {
    // User is the 'sender' (admin)
    const user: User = await this.userService.getUser(req.user.uid);
    // Admin only
    if (!user.isAdmin) {
      return;
    }
    const params: any = body;
    // Get thread
    const thread: Thread = await this.threadService.getThread(params.threadId);
    // Super admin can create prompts for anyone
    if (!user.isSuperAdmin && user.accountId !== thread.accountId) {
      return;
    }
    // Check prompt ownership
    const prompt: Prompt = await this.promptService.getPrompt(params.promptId);
    if (!user.isSuperAdmin && prompt.accountId && prompt.accountId !== user.accountId) {
      return;
    }
    const result = await this.promptService.sendPrompt(prompt, user, thread);
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

  @Get(':promptId')
  @UseGuards(AuthGuard('firebase'))
  async getAccountTracks(@Request() req, @Param() params): Promise<Prompt> {
    const user: User = await this.userService.getUser(req.user.uid);
    const prompt = await this.promptService.getPrompt(params.promptId);
    if (!user.isSuperAdmin && prompt.accountId && user.accountId !== prompt.accountId) {
      return;
    }
    return prompt;
  }

}
