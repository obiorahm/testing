import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

  @Get()
  @UseGuards(AuthGuard('firebase'))
  async index(@Request() req): Promise<string> {
    console.log(req.user.uid)
    return 'TEST';
  }

}
