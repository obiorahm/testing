import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { ThreadService } from 'src/thread/thread.service';
import { Pair, PairRequest } from './pair.models';

const PAIR_PAGE_SIZE = 10;

@Injectable()
export class PairService {

  constructor(
    private readonly threadService: ThreadService,
  ) {}

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

  async createPairRequest(params: any) {
    // TODO: make sure all users are in same account
    const pairRequestCollection = getRepository(PairRequest);
    const pairRequest: PairRequest = new PairRequest();
    pairRequest.isPending = true;
    pairRequest.isAccepted = false;
    pairRequest.userId = params.userId;
    pairRequest.matchIds = params.matchIds;
    pairRequest.accountId = params.accountId;
    pairRequest.createdById = params.createdById;
    pairRequest.createdAt = new Date();
    const result = await pairRequestCollection.create(pairRequest);
    return result;
  }

  async acceptPairRequest(pairRequest: PairRequest) {
    // TODO: use transaction
    // Update pair request
    const pairRequestCollection = getRepository(PairRequest);
    pairRequest.isAccepted = true;
    pairRequest.isPending = false;
    pairRequest.acceptedAt = new Date();
    const pairRequestResult = await pairRequestCollection.update(pairRequest);
    // TODO: cancel pending pair requests for this user ?
    // Create pair
    let userIds = [pairRequestResult.userId]
    pairRequestResult.matchIds.forEach(matchId => {
      userIds.push(matchId);
    });
    const pair = await this.createPair({
      isActive: true,
      userIds: userIds,
      accountId: pairRequest.accountId
    })
    // Create thread
    await this.threadService.createThread({
      userIds: userIds,
      accountId: pairRequest.accountId
    })
    return pair;
  }
}
