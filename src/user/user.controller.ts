import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {

  @Get()
  async index(): Promise<string> {
    return 'TEST';
  }

}
