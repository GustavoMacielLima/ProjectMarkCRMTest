import { Controller, Post, Body } from '@nestjs/common';
import {
  AuthApplication,
  JwtAccessToken,
} from 'src/application/auth/auth.application';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthApplication) {}

  @Post('login')
  create(@Body() { email, password }: AuthDto): Promise<JwtAccessToken> {
    return this.authService.login(email, password);
  }
}
