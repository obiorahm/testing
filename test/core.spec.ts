import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from 'nestjs-firebase';
import { PairController } from 'src/pair/pair.controller';
import { PairService } from 'src/pair/pair.service';
import { DbModule } from 'src/db/db.module';
import { ThreadService } from 'src/thread/thread.service';
import { UserService } from 'src/user/user.service';
import { Account } from 'src/account/account.models';
import { User } from 'src/user/user.models';
import { addedTestUser, getTestAccount, getTestFirebaseUser, getUniqueEmail } from './setup';
import * as firebaseAdmin from 'firebase-admin';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { UserController } from 'src/user/user.controller';
import { AuthGuard } from '@nestjs/passport';

describe('Core Functionality', () => {
  let account: Account;
  let firebaseUser: firebaseAdmin.auth.UserRecord;

  let adminUser: User;
  let nonAdminUser: User;

  let app: INestApplication;
  let pairController: PairController;
  let userService: UserService;

  const getAdminUid = () => adminUser.id

  beforeAll(async () => {

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot({
          googleApplicationCredential: "./config/firebaseCredentialsTest.json"
        }),
        DbModule,
      ],
      controllers: [
        PairController,
        UserController
      ],
      providers: [
        PairService,
        UserService,
        ThreadService
      ],
    })
      .overrideGuard(AuthGuard('firebase'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { uid: getAdminUid() };
          return true
        }
      })
      .compile();

    account = await getTestAccount();
    firebaseUser = await getTestFirebaseUser();

    app = moduleRef.createNestApplication();
    await app.init();

    pairController = app.get<PairController>(PairController);
    userService = app.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an admin user for testing', async () => {
    const user = await userService.createUser({
      firebaseUserId: firebaseUser.uid,
      firstName: 'John',
      lastName: 'Doe',
      email: firebaseUser.email,
      isAdmin: true,
      isSuperAdmin: true,
      accountId: account.id
    });
    expect(user).toBeDefined();
    adminUser = user;
  });

  describe('Users', () => {

    it(`/GET user`, () => {
      return request(app.getHttpServer())
        .get('/user')
        .then((result) => {
          expect(result.body.id).toBe(adminUser.id);
        })
    });

    it('should create a user from non firebase user', async () => {
      const userBody = {
        email: getUniqueEmail('testnonadmin'),
        firstName: 'Jane',
        lastName: 'Doe',
        isAdmin: false,
      }
      return request(app.getHttpServer())
        .post('/user/create')
        .send(userBody)
        .then((result) => {
          nonAdminUser = result.body;
          addedTestUser(nonAdminUser);
          expect(nonAdminUser.firstName).toBe('Jane');
          expect(nonAdminUser.isAdmin).toBe(false);
          expect(nonAdminUser.isSuperAdmin).toBe(false);
        });
    });

    it('should get user data by ID', async () => {
      return request(app.getHttpServer())
        .get('/user/' + nonAdminUser.id)
        .then((result) => {
          const user = result.body;
          expect(user.firstName).toBe('Jane');
          expect(user.isAdmin).toBe(false);
          expect(user.isSuperAdmin).toBe(false);
        });
    });

    // TODO: test register (with existing firebase user)
    // TODO: test change avatar

  });

  describe('Pairs', () => {

    it('should create a pair', async () => {
      const pairBody = {
        isActive: true,
        userIds: [adminUser.id, nonAdminUser.id]
      }
      return request(app.getHttpServer())
        .post('/pair/create')
        .send(pairBody)
        .then((result) => {
          const pair = result.body;
          expect(pair.isActive).toBe(true);
          expect(pair.userIds.length).toBe(2);
          expect(pair.accountId).toBe(adminUser.accountId);
        });
    });
  });
});