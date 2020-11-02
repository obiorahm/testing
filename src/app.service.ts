import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';

import { Todo } from './db/db.models'

@Injectable()
export class AppService {

  async testMethod(): Promise<any> {
    const todoRepository = getRepository(Todo);
    const todo: Todo = await todoRepository.findById('SdJs79MfdHNwqVl7yuHU');
    return todo;
  }
}
