import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../src/access/controller/user/user.controller';
import { UserApplication } from '../src/application/user/user.application';
import { UserRole } from '../src/models/user.model';
import { AuthGuard } from '../src/modules/auth/auth.guard';
import { RoleGuard } from '../src/modules/auth/role.guard';

describe('UserController Basic (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserApplication,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              role: UserRole.VIEWER,
            }),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              role: UserRole.VIEWER,
            }),
            update: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Updated User',
              email: 'test@example.com',
              role: UserRole.VIEWER,
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

  describe('POST /user', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.VIEWER,
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.role).toBe(createUserDto.role);
    });

    it('should return 400 when creating user with invalid email', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'invalid-email',
        role: UserRole.VIEWER,
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 when creating user with missing required fields', async () => {
      const createUserDto = {
        name: 'Test User',
        // email missing
        role: UserRole.VIEWER,
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /user', () => {
    it('should return 200 and list users when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /user/:id', () => {
    it('should return 200 and user data when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
    });
  });

  describe('DELETE /user/:id', () => {
    it('should return 204 when user is deleted successfully', async () => {
      await request(app.getHttpServer()).delete('/user/1').expect(204);
    });
  });
});
