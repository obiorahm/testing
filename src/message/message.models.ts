import { Collection } from 'fireorm';

@Collection('messages')
export class Message {
  id: string;
  body: string;
  type: string; // message, prompt, promptResponse
  senderId?: string; // can be null if prompt
  receiverIds?: Array<string>; // can be null if prompt response
  threadId: string;
  pairId?: string;
  promptResponses?: any; // used to group message with prompt
  accountId: string;
  createdAt: Date;
}