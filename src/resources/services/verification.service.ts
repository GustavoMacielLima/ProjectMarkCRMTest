import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class VerificationService {
  constructor(private readonly emailService: EmailService) {}

  async sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.emailService.sendVerificationEmail(email, verificationCode);
  }

  public generateVerificationCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString(); // Gera um código de 8 dígitos
  }
}
