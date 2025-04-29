import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { GlobalLoggerInterceptor } from './resources/interceptors/global-logger/global-logger.interceptor';
import databaseConfig from './config/database.config';
import { ControllerModule } from './access/controller/controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot(databaseConfig),
    ControllerModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: GlobalLoggerInterceptor },
    ConsoleLogger,
  ],
})
export class AppModule {}
