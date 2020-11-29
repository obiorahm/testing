import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { Pair } from './pair.models';

const PAIR_PAGE_SIZE = 10;

@Injectable()
export class PairService {

  constructor() {}

  async createPair(params: any) {
    const pairCollection = getRepository(Pair);
    const pair: Pair = new Pair();
    pair.isActive = params.isActive;
    pair.userIds = params.userIds;
    pair.accountId = params.accountId;
    pair.createdAt = new Date();
    const result = await pairCollection.create(pair);
    return result
  }

  async getPairsByUser(userId: string, page: number = 0) {
    const pairCollection = getRepository(Pair);
    // TODO: Pagination
    const pairs: Array<Pair> = await pairCollection.whereArrayContains(
      'userIds', userId
    ).whereEqualTo(
      'isActive', true 
    ).orderByDescending(
      'createdAt'
    ).limit(
      PAIR_PAGE_SIZE
    ).find();
    return pairs;
  }

}
