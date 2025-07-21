import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from 'src/models/user.model';
import { SessionService } from 'src/resources/services/session.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles definidas, permite acesso
    if (!requiredRoles) {
      return true;
    }

    const user: User = this.sessionService.getUser();

    // Se não há usuário logado, nega acesso
    if (!user) {
      return false;
    }

    // Verifica se o usuário tem uma das roles necessárias
    return requiredRoles.includes(user.role);
  }
}
