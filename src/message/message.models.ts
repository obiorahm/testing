import { Collection } from 'fireorm';

@Collection('messages')
export class Message {
  id: string;
  message: string;
  senderId: string;
  timestamp: string; // TODO: better date type ?
  userId: string;
  threadId: string;
  pairId?: string;
}