import {
  ConsoleLogger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ListAuthDto } from 'src/modules/auth/dto/list-auth.dto';
import { UserDomain } from 'src/domain/user/user.domain';

export interface UserPayload {
  id: number;
  userName: string;
}

export interface JwtAccessToken {
  accessToken: string;
}

export interface User {
  id: number;
  name: string;
}

@Injectable()
export class AuthApplication {
  constructor(
    private jwtService: JwtService,
    private nativeLogger: ConsoleLogger,
    private userDomain: UserDomain,
  ) {}

  async login(email: string): Promise<JwtAccessToken> {
    try {
      const user: User = await this.userDomain.findByEmail(email);

      const payload: UserPayload = {
        id: user.id,
        userName: user.name,
      };

      this.nativeLogger.log(`uid ${user.id} has authenticated!`);

      return new ListAuthDto(await this.jwtService.signAsync(payload));
    } catch (error) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
  }
}
