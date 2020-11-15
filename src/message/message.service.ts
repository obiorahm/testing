import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { getRepository } from 'fireorm';
import { Message } from './message.models';

@Injectable()
export class MessageService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {}

  async createMessage(params: any) {
    const messageCollection = getRepository(Message);
    const message: Message = new Message();
    message.body = params.body;
    message.senderId = params.senderId;
    message.receiverId = params.receiverId;
    message.threadId = params.threadId;
    message.pairId = params.pairId;
    message.accountId = params.accountId;
    message.createdAt = new Date();
    const result = await messageCollection.create(message);
    return result
  }

}
