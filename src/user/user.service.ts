import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { auth } from 'firebase-admin'
import { getRepository } from 'fireorm';

import { User } from './user.models';

@Injectable()
export class UserService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {}

  async getUser(uid: string) {
    const userCollection = getRepository(User);
    const user: User = await userCollection.findById(uid);
    return user;
  }

  async getFirebaseUser(uid: string) {
    const user = await this.firebase.auth.getUser(uid);
    return user;
  }

  async verifyFirebaseToken(token: string): Promise<string> {
    const idToken: auth.DecodedIdToken = await this.firebase.auth.verifyIdToken(token);
    let uid = null;
    if (idToken) {
      uid = idToken.uid;
    }
    return uid;
  }

}
