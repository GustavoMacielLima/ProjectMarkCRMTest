import { Injectable, Scope } from '@nestjs/common';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  private user: User | null = null;
  private company: Company | null = null;

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }

  setCompany(company: Company): void {
    this.company = company;
  }

  getCompany(): Company | null {
    return this.company;
  }

  clearCompany(): void {
    this.company = null;
  }

  clearSession(): void {
    this.clearUser();
    this.clearCompany();
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  isCompanyAuthenticated(): boolean {
    return this.company !== null;
  }
}
