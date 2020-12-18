import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { MessageService } from 'src/message/message.service';
import { Thread } from 'src/thread/thread.models';
import { ThreadService } from 'src/thread/thread.service';
import { User } from 'src/user/user.models';
import { Prompt, PromptResponse } from './prompt.models';

@Injectable()
export class PromptService {

  constructor(
    private readonly messageService: MessageService,
    private readonly threadService: ThreadService,
  ) {}

  async getPrompt(promptId: string) {
    const promptCollection = getRepository(Prompt);
    const prompt: Prompt = await promptCollection.findById(promptId);
    return prompt;
  }

  async createPrompt(params: any) {
    const promptCollection = getRepository(Prompt);
    const prompt: Prompt = new Prompt();
    prompt.type = params.type;
    prompt.category = params.category;
    prompt.content = params.content;
    prompt.trackId = params.trackId;
    prompt.accountId = params.accountId;
    prompt.createdById = params.createdById;
    prompt.createdAt = new Date();
    const result = await promptCollection.create(prompt);
    return result;
  }

  // TODO: use transaction
  async sendPrompt(prompt: Prompt, sender: User, thread: Thread) {
    // Create response for all users in thread
    const promptResponseCollection = getRepository(PromptResponse);
    let newResponses = {} as Array<PromptResponse>;
    for (let userId of thread.userIds) {
      const promptResponse: PromptResponse = new PromptResponse();
      promptResponse.hasResponded = false;
      promptResponse.promptId = prompt.id;
      promptResponse.trackId = prompt.trackId;
      promptResponse.userId = userId;
      promptResponse.threadId = thread.id;
      promptResponse.pairId = thread.pairId;
      promptResponse.accountId = thread.accountId;
      promptResponse.sentById = sender.id;
      promptResponse.createdAt = new Date();
      const newResponse: PromptResponse = await promptResponseCollection.create(
        promptResponse
      );
      newResponses[userId] = newResponse;
    }
    let newResponsesMap = {};
    for (const userId in newResponses) {
      newResponsesMap[userId] = newResponses[userId].id;
    }
    // Add message to thread
    let messageData: any = {
      body: prompt.content,
      type: 'prompt',
      threadId: thread.id,
      pairId: thread.pairId,
      promptResponses: newResponsesMap,
      accountId: thread.accountId,
      createdAt: new Date()
    }
    await this.messageService.createMessage(messageData)
    return newResponses;
  }

  async getPromptResponse(promptResponseId: string) {
    const promptResponseCollection = getRepository(PromptResponse);
    const promptResponse: PromptResponse = await promptResponseCollection.findById(
      promptResponseId
    );
    return promptResponse;
  }

  // TODO: use transaction
  async addPromptResponse(promptResponse: PromptResponse, user: User, response: string) {
    if (!promptResponse.responses) {
      promptResponse.responses = []
    }
    // Add prompt response
    promptResponse.responses.push({
      response: response,
      time: new Date()
    });
    promptResponse.hasResponded = true;
    const promptResponseCollection = getRepository(PromptResponse);
    const updatedPromptResponse = await promptResponseCollection.update(promptResponse);
    // Add message to thread
    let messageData: any = {
      body: response,
      type: 'promptResponse',
      senderId: promptResponse.userId, 
      threadId: promptResponse.threadId,
      promptResponseId: updatedPromptResponse.id,
      accountId: user.accountId,
      createdAt: new Date()
    }
    const thread = await this.threadService.getThread(promptResponse.threadId);
    let receiverIds = [];
    thread.userIds.forEach((userId) => {
      if (userId !== promptResponse.userId) {
        receiverIds.push(userId);
      }
    });
    messageData.receiverIds = receiverIds;
    if (thread.pairId) {
      messageData.pairId = thread.pairId;
    }
    await this.messageService.createMessage(messageData)
    return updatedPromptResponse;
  }

}
