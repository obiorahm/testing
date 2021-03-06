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
    // Get thread
    const threadCollection = getRepository(Thread);
    const thread = await threadCollection.findById(params.threadId);
    // Set message fields
    const messageCollection = getRepository(Message);
    const message: Message = new Message();
    message.body = params.body;
    message.type = params.type;
    message.senderId = params.senderId;
    message.threadId = params.threadId;
    message.pairId = thread.pairId;
    message.promptResponses = params.promptResponses;
    message.accountId = params.accountId;
    message.createdAt = new Date();
    // Add to thread
    thread.lastMessage = convertToObject(message); // TODO: this is merging instead of overwriting
    await threadCollection.update(thread); 
    // Create message
    message.receiverIds = thread.userIds.filter((userId) => {
      return userId !== params.senderId;
    });
    const result = await messageCollection.create(message);
    await this.sendPushNotification(result);
    // TODO: handle integrations (slack message, etc.)
    return result;
  }

  async sendPushNotification(message: Message) {
    if (!message.receiverIds) {
      return;
    }
    const userCollection = getRepository(User);
    for (const receiverId of message.receiverIds) {
      const receiver = await userCollection.findById(receiverId);
      let title = 'New Prompt';
      if (message.senderId) {
        const sender = await userCollection.findById(message.senderId);
        title = 'Message from ' + sender.firstName;
      }
      if (!receiver.pushToken) {
        continue;
      }
      const notification = {
        to: receiver.pushToken,
        sound: 'default',
        title: title,
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

}
