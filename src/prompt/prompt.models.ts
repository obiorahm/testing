import { Collection } from 'fireorm';

@Collection('prompts')
export class Prompt {
  id: string;
  body: string;
  responses?: any;
  threadId: string;
  userIds: Array<string>;
  accountId: string;
  createdAt: Date;
}