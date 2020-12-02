import { Collection } from 'fireorm';

@Collection('prompt')
export class Prompt {
  id: string;
  type: string; // solo, group, training
  category: string;  // leadership, inclusion, 
  content: string;
  links?: Array<string>;
  accountId?: string;
  createdById?: string; // User that added the prompt
  createdAt: Date;
}

@Collection('promptResponses')
export class PromptResponse {
  id: string;
  responses?: Array<any>; // list of responses
  data?: any; // interactions and empirical response data
  hasResponded: boolean; // true if there has been at least one response
  promptId: string;
  userId: string;
  threadId: string;
  pairId?: string;
  accountId: string;
  sentById?: string;
  createdAt: Date;
}
