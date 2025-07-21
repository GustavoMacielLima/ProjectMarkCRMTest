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
      from: '"crm" <no-reply@crm.com.br>', // Substitua pelo remetente
      to,
      subject: 'Código de Verificação',
      text: `Seu código de verificação é: ${code}`,
      html: emailHtml.replace('{{1}}', code),
    };

    await this.transporter.sendMail(mailOptions);
  }
}

const emailHtml: string = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Código de Verificação</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: Arial, sans-serif;
      }

      .container {
        max-width: 600px;
        margin: 2rem auto;
        background-color: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .logo {
        width: 150px;
        margin: 0 auto 1.5rem;
      }

      h1 {
        color: #3fb4a6;
        font-size: 1.5rem;
        margin-bottom: 1.2rem;
      }

      .code {
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 0.3rem;
        margin-bottom: 1.5rem;
        color: #000;
      }

      p {
        font-size: 1rem;
        color: #333;
        margin-bottom: 1rem;
      }

      .btn {
        display: inline-block;
        background-color: #3fb4a6;
        color: white;
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        margin-top: 1rem;
      }

      @media (max-width: 480px) {
        .container {
          padding: 1rem;
        }

        h1 {
          font-size: 1.2rem;
        }

        .code {
          font-size: 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img
        src="https://codigocrm.my.canva.site/_assets/media/738c65f1546f8f7e0567a046879cca1e.png"
        alt="crm"
        class="logo"
      />
      <h1>Código de verificação</h1>
      <div class="code">{{1}}</div>
      <p>
        Use esse código de acesso para verificar o endereço de e-mail associado
        à sua conta.
      </p>
    </div>
  </body>
</html>
`;
