import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from 'src/application/auth/auth.application';
import { User } from 'src/models/user.model';
import { SessionService } from 'src/resources/services/session.service';

export interface RequestUser extends Request {
  user: UserPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestUser = context
      .switchToHttp()
      .getRequest<RequestUser>();
    const token: string = await this.tokenExtractionHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      const user: User = await User.findOne({
        where: { id: payload.id },
      });
      if (!user) {
        throw new UnauthorizedException('USER_NOT_FOUND');
      }
      this.sessionService.setUser(user); // Armazena o payload no SessionService
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    return true;
  }

  private tokenExtractionHeader(request: Request): string | undefined {
    //formato do cabeçalho authorization: "Bearer <valor_jwt>"
    const [tipo, token]: Array<string> =
      request.headers.authorization?.split(' ') ?? [];

    return tipo === 'Bearer' ? token : undefined;
  }
}
