import { Collection, getRepository } from "fireorm";
import { Account } from "src/account/account.models";
import * as firebaseAdmin from 'firebase-admin';

// @ts-ignore
// (global as any).randomVar = 'test'

const tempUserEmails = [];
export const getUniqueEmail = (email: string) => {
  const unique = `${email}#${new Date().getTime()}@example.com`;
  tempUserEmails.push(unique);
  console.log(`Created firebase user with email: ${unique}`);
  return unique;
};

const testAccount = new Account();
testAccount.name = 'Test Account';

export const getTestAccount = async (): Promise<Account> => {
  const accountRepository = getRepository(Account);
  const account = await accountRepository.create(testAccount);
  return account;
}

const tempUserIds = [];
export const getTestFirebaseUser = async (): Promise<firebaseAdmin.auth.UserRecord> => {
  const firebaseUser = await firebaseAdmin.auth().createUser({
    email: getUniqueEmail('testuser'),
    password: 'TestPassword1!',
    displayName: 'John Doe',
  });
  tempUserIds.push(firebaseUser.uid);
  return firebaseUser;
}

export const addedTestUser = (user) => {
  tempUserIds.push(user.id)
}

afterAll(async (done) => {
  const firestore = firebaseAdmin.firestore();
  const deleteCollections = ['accounts', 'users'];
  console.info('Deleting collections', deleteCollections);
  for (const collection of deleteCollections) {
    const batch = firestore.batch();
    const docs = await firestore.collection(collection).listDocuments();
    for (const doc of docs) {
      batch.delete(doc);
    }
    await batch.commit();
  }

  console.info('Deleting Users', tempUserIds);

  for (const tempUserId of tempUserIds) {
    await firebaseAdmin.auth().deleteUser(tempUserId);
  }

  done();
});