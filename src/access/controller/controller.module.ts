import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationModule } from 'src/application/application.module';
import { DomainModule } from 'src/domain/domain.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { SessionService } from 'src/resources/services/session.service';
import { PdvController } from './pdv/pdv.controller';
import { ContractController } from './contract/contract.controller';
import { CompanyController } from './company/company.controller';
import { OrderController } from './order/order.controller';

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
  controllers: [
    AuthController,
    UserController,
    PdvController,
    ContractController,
    CompanyController,
    OrderController,
  ],
})
export class ControllerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Configure middleware if needed
    consumer
      .apply()
      .forRoutes(
        UserController,
        PdvController,
        ContractController,
        CompanyController,
        OrderController,
      );
  }
}
