import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import { Thread } from './thread.models';

const THREAD_PAGE_SIZE = 10;

@Injectable()
export class ThreadService {

  constructor() {}

  async getThread(threadId: string) {
    const threadCollection = getRepository(Thread);
    const thread: Thread = await threadCollection.findById(threadId);
    return thread;
  }
  
  async getUserThreads(uid: string) {
    const threadCollection = getRepository(Thread);
    const threads: Array<Thread> = await threadCollection.whereArrayContains(
      'userIds', uid
    ).limit(
      THREAD_PAGE_SIZE
    ).find();
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
