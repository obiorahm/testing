import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';

import { User } from './user/user.models'

@Injectable()
export class AppService {

  async testMethod(): Promise<any> {
    const todoRepository = getRepository(User);
    const todo: User = await todoRepository.findById('bxaYXMAd1va2b5vfUMen');
    return todo;
  }
}
