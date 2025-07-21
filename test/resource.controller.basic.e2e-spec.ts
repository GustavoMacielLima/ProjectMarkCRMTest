import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ResourceController } from '../src/access/controller/resource/resource.controller';
import { ResourceApplication } from '../src/application/resource/resource.application';
import { ResourceType } from '../src/models/resource.model';
import { AuthGuard } from '../src/modules/auth/auth.guard';
import { RoleGuard } from '../src/modules/auth/role.guard';

describe('ResourceController Basic (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ResourceController],
      providers: [
        {
          provide: ResourceApplication,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              type: ResourceType.VIDEO,
              url: 'https://example.com/video',
              description: 'Test video resource',
              topicId: 1,
            }),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              type: ResourceType.VIDEO,
              url: 'https://example.com/video',
              description: 'Test video resource',
              topicId: 1,
            }),
            update: jest.fn().mockResolvedValue({
              id: 1,
              type: ResourceType.VIDEO,
              url: 'https://example.com/video',
              description: 'Updated description',
              topicId: 1,
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /resource', () => {
    it('should create a new resource', async () => {
      const createResourceDto = {
        type: ResourceType.VIDEO,
        url: 'https://example.com/video',
        description: 'Test video resource',
        topicId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/resource')
        .send(createResourceDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(createResourceDto.type);
      expect(response.body.url).toBe(createResourceDto.url);
      expect(response.body.description).toBe(createResourceDto.description);
    });

    it('should return 400 when creating resource with missing required fields', async () => {
      const createResourceDto = {
        type: ResourceType.VIDEO,
        // url missing
        description: 'Test video resource',
      };

      await request(app.getHttpServer())
        .post('/resource')
        .send(createResourceDto)
        .expect(400);
    });

    it('should return 400 when creating resource with invalid type', async () => {
      const createResourceDto = {
        type: 'INVALID_TYPE',
        url: 'https://example.com/video',
        description: 'Test video resource',
      };

      await request(app.getHttpServer())
        .post('/resource')
        .send(createResourceDto)
        .expect(400);
    });
  });

  describe('GET /resource', () => {
    it('should return 200 and list resources when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/resource')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /resource/:id', () => {
    it('should return 200 and resource data when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/resource/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('description');
    });
  });

  describe('DELETE /resource/:id', () => {
    it('should return 204 when resource is deleted successfully', async () => {
      await request(app.getHttpServer()).delete('/resource/1').expect(204);
    });
  });
});
