import { Collection } from 'fireorm';

@Collection('accounts')
export class Account {
  id: string;
  name: string;
}