import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule } from 'nestjs-firebase';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserService } from './user/user.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot({
          googleApplicationCredential: "./config/pairuptest-firebase-adminsdk-klpv9-82fa2dd61d.json",
        }),
        DbModule,
      ],
      controllers: [AppController],
      providers: [
        UserService,
        AppService
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const result = await appController.getHello();
      expect(result).toBe('Hello World');
    });
  });
});
