import { Collection } from 'fireorm';

@Collection('tracks')
export class Track {
  id: string;
  name: string;
  accountId?: string;
  createdById?: string;
  prompts: Array<any>;
  createdAt: Date;
}