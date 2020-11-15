import { Collection } from 'fireorm';

@Collection('pairs')
export class Pair {
  id: string;
  isActive: boolean;
  userIds: Array<string>;
  accountId: string;
  createdAt: Date;
}