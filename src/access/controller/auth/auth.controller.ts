import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthApplication,
  JwtAccessToken,
} from 'src/application/auth/auth.application';
import { UserApplication } from 'src/application/user/user.application';
import { User } from 'src/models/user.model';
import { AuthGuard, RequestUser } from 'src/modules/auth/auth.guard';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';
import { ListUserDto } from 'src/modules/user/dto/list-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthApplication,
    private readonly userApplication: UserApplication,
  ) {}

  @Post('login')
  create(@Body() { email, password }: AuthDto): Promise<JwtAccessToken> {
    return this.authService.login(email, password);
  }

  @Put(':id/validate')
  @UseGuards(AuthGuard)
  async validate(
    @Param('id') id: string,
    @Body('code') validateCode: string, // Supondo que o código seja enviado como { code: "value" }
    @Req() requestUser: RequestUser,
  ): Promise<ListUserDto> {
    const user: User = await this.userApplication.validate(
      requestUser.user.sub,
      validateCode,
    );
    return new ListUserDto(
      user.stringId,
      user.fullName,
      user.email,
      user.phone,
      user.role,
      user.isActive,
      user.identifier,
    );
  }
}
