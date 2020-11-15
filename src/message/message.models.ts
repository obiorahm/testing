import { Collection } from 'fireorm';

@Collection('messages')
export class Message {
  id: string;
  body: string;
  senderId: string;
  receiverId: string;
  threadId: string;
  pairId?: string;
  accountId: string;
  createdAt: Date;
}