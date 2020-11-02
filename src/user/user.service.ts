import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { auth } from 'firebase-admin'

@Injectable()
export class UserService {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {}

  async getUser() {
    const user = await this.firebase.auth.getUser('IueCgY4cAWcxjhIFkIcnq0lpego1');
    return user;
  }

  async verifyUserToken(token: string): Promise<string> {
    const idToken: auth.DecodedIdToken = await this.firebase.auth.verifyIdToken(token);
    let uid = null;
    if (idToken) {
      uid = idToken.uid;
    }
    return uid;
  }

}
