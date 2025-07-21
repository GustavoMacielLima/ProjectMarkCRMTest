import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TopicController } from '../src/access/controller/topic/topic.controller';
import { TopicApplication } from '../src/application/topic/topic.application';
import { AuthGuard } from '../src/modules/auth/auth.guard';
import { RoleGuard } from '../src/modules/auth/role.guard';

describe('TopicController Basic (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicApplication,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test Topic',
              content: 'Test content',
              parentTopicId: null,
            }),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test Topic',
              content: 'Test content',
              parentTopicId: null,
            }),
            findAllTopicsWithSubTopics: jest.fn().mockResolvedValue([]),
            findAllSubTopics: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Updated Topic',
              content: 'Updated content',
              parentTopicId: null,
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

  describe('POST /topic', () => {
    it('should create a new topic', async () => {
      const createTopicDto = {
        name: 'Test Topic',
        content: 'Test content',
      };

      const response = await request(app.getHttpServer())
        .post('/topic')
        .send(createTopicDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createTopicDto.name);
      expect(response.body.content).toBe(createTopicDto.content);
    });

    it('should return 400 when creating topic with missing required fields', async () => {
      const createTopicDto = {
        name: 'Test Topic',
        // content missing
      };

      await request(app.getHttpServer())
        .post('/topic')
        .send(createTopicDto)
        .expect(400);
    });
  });

  describe('GET /topic', () => {
    it('should return 200 and list topics when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/topic')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /topic/:id', () => {
    it('should return 200 and topic data when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/topic/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('content');
    });
  });

  describe('GET /topic/:id/tree', () => {
    it('should return 200 and subtopics tree when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/topic/1/tree')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /topic/:id', () => {
    it('should return 204 when topic is deleted successfully', async () => {
      await request(app.getHttpServer()).delete('/topic/1').expect(204);
    });
  });
});
