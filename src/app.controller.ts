import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DbProvider } from './db/db';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly db: DbProvider
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const todo = await this.appService.testMethod();
    const user = await this.userService.getUser();
    console.log(todo)
    console.log(user)
    return 'Hello World';
  }
}
