import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

@Injectable()
export class PasswordHash implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(password: string): Promise<string> {
    const sal: string = this.configService.get<string>('SAL_PASSWORD');
    return await bcrypt.hash(password, sal!);
  }
}
