import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  private user: User | null = null;

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }

  clearSession(): void {
    this.clearUser();
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}
