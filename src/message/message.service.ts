import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import fetch from 'node-fetch';
import { Message } from './message.models';
import { Thread } from 'src/thread/thread.models';
import { convertToObject } from 'src/utils';
import { User } from 'src/user/user.models';

const MESSAGE_PAGE_SIZE: number = 10;

@Injectable()
export class MessageService {

  constructor() {}

  async getThreadMessages(threadId: string, page: number = 0) {
    const messageCollection = getRepository(Message);
    // TODO: Pagination
    const messages: Array<Message> = await messageCollection.whereEqualTo(
      'threadId', threadId
    ).orderByDescending(
      'createdAt'
    ).limit(
      MESSAGE_PAGE_SIZE
    ).find();
    return messages;
  }

  async createMessage(params: any) {
    // Set message fields
    const messageCollection = getRepository(Message);
    const message: Message = new Message();
    message.body = params.body;
    message.senderId = params.senderId;
    message.receiverId = params.receiverId;
    message.threadId = params.threadId;
    message.pairId = params.pairId;
    message.accountId = params.accountId;
    message.createdAt = new Date();
    // Add to thread
    const threadCollection = getRepository(Thread);
    const thread = await threadCollection.findById(params.threadId)
    thread.lastMessage = convertToObject(message);
    await threadCollection.update(thread);
    // Create message
    const result = await messageCollection.create(message);
    await this.sendPushNotification(result);
    // TODO: send push notification / handle integrations (slack message, etc.)
    return result;
  }

  async sendPushNotification(message: Message) {
    if (!message.receiverId) {
      return;
    }
    const userCollection = getRepository(User);
    const receiver = await userCollection.findById(message.receiverId);
    const sender = await userCollection.findById(message.senderId);
    if (!receiver.pushToken) {
      return;
    }
    const notification = {
      to: receiver.pushToken,
      sound: 'default',
      title: 'Message from ' + sender.firstName,
      body: message.body
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
  }

}
