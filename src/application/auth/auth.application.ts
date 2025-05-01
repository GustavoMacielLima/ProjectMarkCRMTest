import {
  ConsoleLogger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ListAuthDto } from 'src/modules/auth/dto/list-auth.dto';
import { UserDomain } from 'src/domain/user/user.domain';

export interface UserPayload {
  sub: string;
  internalSub: number;
  companyId: number;
  userName: string;
}

export interface JwtAccessToken {
  accessToken: string;
}

export interface User {
  //Trocar pela Entidade ou extender dela
  password: string;
  id: number;
  stringId: string;
  companyId: number;
  name: string;
}

@Injectable()
export class AuthApplication {
  constructor(
    private jwtService: JwtService,
    private nativeLogger: ConsoleLogger,
    private userDomain: UserDomain,
  ) {}

  async login(email: string, password: string): Promise<JwtAccessToken> {
    const user: User = await this.userDomain.findByEmail(email);
    const auth: boolean = await compare(password, user.password);
    if (!auth) {
      throw new UnauthorizedException();
    }

    const payload: UserPayload = {
      sub: user.stringId,
      internalSub: user.id,
      companyId: user.companyId,
      userName: user.name,
    };

    this.nativeLogger.log(`uid ${user.id} has authenticated!`);

    return new ListAuthDto(await this.jwtService.signAsync(payload));
  }
}
