import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/models/user.model';
import { Topic } from '../../src/models/topic.model';
import { Resource } from '../../src/models/resource.model';

export class TestSetup {
  static async createTestingApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    // Configurar validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    return app;
  }

  static async cleanupDatabase(): Promise<void> {
    // Limpar todas as tabelas em ordem reversa (devido às foreign keys)
    await Resource.destroy({ where: {}, force: true });
    await Topic.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
  }

  static async closeApp(app: INestApplication): Promise<void> {
    await app.close();
  }
}
