import { CanActivate, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/models/user.model';
import { SessionService } from 'src/resources/services/session.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate(): boolean {
    const user: User = this.sessionService.getUser();

    // Check if the user has the required role
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    // If the user does not have the required role, deny access
    return false;
  }
}
