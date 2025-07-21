import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Simple Test (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should return 404 for unknown route', () => {
    return request(app.getHttpServer()).get('/unknown-route').expect(404);
  });
});
