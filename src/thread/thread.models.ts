import { Collection } from 'fireorm';
import { Message } from 'src/message/message.models';

@Collection('threads')
export class Thread {
  id: string;
  isReflection: boolean;
  lastMessage?: Message;
  lastMessageAt?: string; // TODO: might get this from lastMessage
  createdAt: Date;
  userIds: Array<string>;
  pairId?: string;
  accountId: string;
}