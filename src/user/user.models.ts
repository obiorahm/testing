import { Collection } from 'fireorm';

@Collection('users')
export class User {
  id: string;
  email: string;
  isAdmin: boolean; // Organization Admin
  isSuperAdmin: boolean; // Pair Up Admin
  firstName: string;
  lastName: string;
  isPaired: boolean; // TODO: should not be needed
  pairId: string; // TODO: should not be needed
  reflectionType: string; // TODO: might not be needed
  showWelcome: boolean;
  pushToken?: string;
  accountId?: string;
}