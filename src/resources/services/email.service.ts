import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Substitua pelo host SMTP
      port: Number(process.env.EMAIL_PORT), // Porta SMTP
      secure: Number(process.env.EMAIL_PORT) === 465, // Use true para 465, false para outras portas
      auth: process.env.EMAIL_USERNAME
        ? {
            user: process.env.EMAIL_USERNAME, // Substitua pelo seu e-mail
            pass: process.env.EMAIL_PASSWORD, // Substitua pela sua senha
          }
        : undefined,
    } as nodemailer.TransportOptions);
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    const mailOptions = {
      from: '"MgPix" <no-reply@mgpix.com.br>', // Substitua pelo remetente
      to,
      subject: 'Código de Verificação',
      text: `Seu código de verificação é: ${code}`,
      html: `<p>Seu código de verificação é: <strong>${code}</strong></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
