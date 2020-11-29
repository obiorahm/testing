import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { getRepository } from 'fireorm';

import { User } from './user.models';

@Injectable()
export class UserService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {}

  async getUser(userId: string) {
    const userCollection = getRepository(User);
    const user: User = await userCollection.findById(userId);
    return user;
  }

  async createUser(params: any): Promise<any> {
    const userCollection = getRepository(User);
    const user = new User();
    // TODO: create firebase user and assign user.id to firebase uid
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.email = params.email;
    user.isAdmin = params.isAdmin;
    user.accountId = params.accountId;
    const result = await userCollection.create(user);
    return result
  }

  async updateUser(userId: string, params: any) {
    const userCollection = getRepository(User);
    const user = await userCollection.findById(userId);
    Object.keys(params).forEach((key) => {
      user[key] = params[key];
    })
    const updatedUser = await userCollection.update(user);
    return updatedUser;
  }

  async getFirebaseUser(uid: string) {
    const user = await this.firebase.auth.getUser(uid);
    return user;
  }

}
