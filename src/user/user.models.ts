import { Collection } from 'fireorm';

@Collection('users')
export class User {
  id: string;
  email: string;
  displayName: string;
}