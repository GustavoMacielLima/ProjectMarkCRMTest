import { Controller, Post, Body } from '@nestjs/common';
import {
  AuthApplication,
  JwtAccessToken,
} from 'src/application/auth/auth.application';
import { UserApplication } from 'src/application/user/user.application';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthApplication,
    private readonly userApplication: UserApplication,
  ) {}

  @Post('login')
  create(@Body() { email }: AuthDto): Promise<JwtAccessToken> {
    return this.authService.login(email);
  }
}
