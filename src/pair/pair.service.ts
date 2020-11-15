import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { getRepository } from 'fireorm';
import { Pair } from './pair.models';

@Injectable()
export class PairService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
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

}
