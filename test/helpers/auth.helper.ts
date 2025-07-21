import { UserRole } from '../../src/models/user.model';

export class AuthHelper {
  static createMockToken(role: UserRole = UserRole.ADMIN): string {
    // Mock JWT token - em um ambiente real, você geraria um token válido
    // Retorna um token mock simples
    return `Bearer mock-token-${role}`;
  }

  static getAuthHeaders(role: UserRole = UserRole.ADMIN): {
    Authorization: string;
  } {
    return {
      Authorization: this.createMockToken(role),
    };
  }
}
