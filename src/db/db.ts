import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import * as fireorm from 'fireorm';

@Injectable()
export class DbProvider {

  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
  ) {
    firebase.db.settings({ignoreUndefinedProperties: true})
    fireorm.initialize(firebase.db);
  }

}
