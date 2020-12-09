import { Collection } from 'fireorm';

@Collection('pairs')
export class Pair {
  id: string;
  isActive: boolean;
  userIds: Array<string>;
  accountId: string;
  createdById?: string;
  createdAt: Date;
}

@Collection('pairRequests')
export class PairRequest {
  id: string;
  isPending: boolean; // pair request is awaiting response
  isAccepted: boolean; // pair request was accepted
  acceptedAt: Date;
  userId: string;
  matchIds: Array<string>; // ID of suggested pair users
  accountId: string;
  createdById?: string;
  createdAt: Date;
}