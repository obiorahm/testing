import { Collection } from 'fireorm';

@Collection('pairs')
export class Pair {
  id: string;
  userIds: Array<string>;
  isActive: boolean;
}