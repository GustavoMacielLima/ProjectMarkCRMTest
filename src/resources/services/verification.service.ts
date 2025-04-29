import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class VerificationService {
  constructor(private readonly emailService: EmailService) {}

  async sendVerificationCode(email: string): Promise<string> {
    const code = this.generateVerificationCode();
    await this.emailService.sendVerificationEmail(email, code);
    return code;
  }

  private generateVerificationCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString(); // Gera um código de 8 dígitos
  }
}
