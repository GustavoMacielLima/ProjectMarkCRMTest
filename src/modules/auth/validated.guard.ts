import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from 'src/application/auth/auth.application';
import { User } from 'src/models/user.model';
import { SessionService } from 'src/resources/services/session.service';

export interface RequestUser extends Request {
  user: UserPayload;
}

@Injectable()
export class ValidatedGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}
  async canActivate(): Promise<boolean> {
    const user: User = this.sessionService.getUser();
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('USER_NOT_VALIDATED');
    }
    return true;
  }
}
