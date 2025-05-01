import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs'; // Use named import for hash

@Injectable()
export class PasswordHash implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(password: string): Promise<string> {
    const sal: string = this.configService.get<string>('SAL_PASSWORD');
    return await hash(password, sal!); // Use the named import here
  }
}
