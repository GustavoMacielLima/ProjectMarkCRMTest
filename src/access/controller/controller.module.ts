import { Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationModule } from 'src/application/application.module';
import { DomainModule } from 'src/domain/domain.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { SessionService } from 'src/resources/services/session.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
    ApplicationModule,
    DomainModule,
  ],
  providers: [SessionService],
  controllers: [AuthController, UserController],
})
export class ControllerModule implements NestModule {
  configure(consumer: any) {
    // Configure middleware if needed
    consumer.apply().forRoutes('*');
  }
}
