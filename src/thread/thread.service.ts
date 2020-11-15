import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { getRepository, IQueryable } from 'fireorm';
import { Thread } from './thread.models';

@Injectable()
export class ThreadService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {}

  async getUserThreads(uid: string) {
    const threadCollection = getRepository(Thread);
    const query: IQueryable<Thread> = threadCollection.whereArrayContains('userIds', uid);
    const threads: Array<Thread> = await query.find();
    return threads;
  }

  async createThread(params: any) {
    const threadCollection = getRepository(Thread);
    const thread: Thread = new Thread();
    thread.userIds = params.userIds;
    thread.accountId = params.accountId;
    thread.createdAt = new Date();
    thread.isReflection = params.isReflection;
    const result = await threadCollection.create(thread);
    return result
  }

}
