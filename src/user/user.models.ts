import { Collection } from 'fireorm';

@Collection('users')
export class User {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  isPaired: boolean; // TODO: should not be needed
  pairId: string; // TODO: should not be needed
  reflectionType: string; // TODO: might not be needed
  showWelcome: boolean;
  accountId: string;
}