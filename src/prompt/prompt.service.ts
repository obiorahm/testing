import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { User } from 'src/user/user.models';
import { Prompt } from './prompt.models';

@Injectable()
export class PromptService {

  async getPrompt(promptId: string) {
    const promptCollection = getRepository(Prompt);
    const prompt: Prompt = await promptCollection.findById(promptId);
    return prompt;
  }

  async createPrompt(params: any) {
    const promptCollection = getRepository(Prompt);
    const prompt: Prompt = new Prompt();
    prompt.body = params.body;
    prompt.threadId = params.threadId;
    prompt.userIds = params.userIds;
    prompt.accountId = params.accountId;
    prompt.createdAt = new Date();
    const result = await promptCollection.create(prompt);
    return result;
  }

  async addPromptResponse(prompt: Prompt, user: User, response: string) {
    let responses = Object.assign({}, prompt.responses);
    if (!responses[user.id]) {
      responses[user.id] = []
    }
    responses[user.id].push({
      response: response,
      time: new Date()
    });
    prompt.responses = responses;
    const promptCollection = getRepository(Prompt);
    const updatedPrompt = await promptCollection.update(prompt);
    return updatedPrompt;
  }

}
