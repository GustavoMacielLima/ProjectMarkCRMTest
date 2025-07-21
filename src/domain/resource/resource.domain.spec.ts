import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'sequelize-typescript';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ResourceDomain } from './resource.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Resource, ResourceType } from 'src/models/resource.model';
import { User, UserRole } from 'src/models/user.model';
import { RepositoryProvider } from '../../repository/repository.provider';

describe('ResourceDomain', () => {
  let resourceDomain: ResourceDomain;
  let resourceRepository: jest.Mocked<Repository<Resource>>;
  let sessionService: any;

  // Mock data
  const mockUser: User = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as User;

  const mockEditorUser: User = {
    id: 2,
    name: 'Editor User',
    email: 'editor@example.com',
    role: UserRole.EDITOR,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as User;

  const mockResource: Resource = {
    id: 1,
    topicId: 1,
    type: ResourceType.VIDEO,
    url: 'https://example.com/video',
    description: 'Test video resource',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Resource;

  const mockNewResource: Partial<Resource> = {
    topicId: 1,
    type: ResourceType.ARTICLE,
    url: 'https://example.com/article',
    description: 'Test article resource',
    setDataValue: jest.fn(),
    get: jest.fn().mockReturnValue({
      topicId: 1,
      type: ResourceType.ARTICLE,
      url: 'https://example.com/article',
      description: 'Test article resource',
    }),
  };

  beforeEach(async () => {
    // Create mock repository
    const mockRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    // Create mock session service
    const mockSessionService = {
      getUser: jest.fn(),
      setUser: jest.fn(),
      clearUser: jest.fn(),
      clearSession: jest.fn(),
      isAuthenticated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceDomain,
        {
          provide: RepositoryProvider.RESOURCE,
          useValue: mockRepository,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    resourceDomain = module.get<ResourceDomain>(ResourceDomain);
    resourceRepository = module.get(RepositoryProvider.RESOURCE);
    sessionService = module.get<SessionService>(SessionService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewResource', () => {
    it('should create a new resource when user is admin', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(mockUser);
      resourceRepository.findOne.mockResolvedValue(null);
      resourceRepository.create.mockResolvedValue(mockResource);

      // Act
      const result = await resourceDomain.createNewResource(
        mockNewResource as Resource,
      );

      // Assert
      expect(sessionService.getUser).toHaveBeenCalled();
      expect(resourceRepository.findOne).toHaveBeenCalledWith({
        where: { url: mockNewResource.url, deletedAt: null },
      });
      expect(resourceRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockResource);
    });

    it('should throw UnauthorizedException when user is not admin', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(mockEditorUser);

      // Act & Assert
      await expect(
        resourceDomain.createNewResource(mockNewResource as Resource),
      ).rejects.toThrow(UnauthorizedException);

      expect(sessionService.getUser).toHaveBeenCalled();
      expect(resourceRepository.findOne).not.toHaveBeenCalled();
      expect(resourceRepository.create).not.toHaveBeenCalled();
    });

    it('should proceed when no user is logged in (null check)', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(null);
      resourceRepository.findOne.mockResolvedValue(null);
      resourceRepository.create.mockResolvedValue(mockResource);

      // Act
      const result = await resourceDomain.createNewResource(
        mockNewResource as Resource,
      );

      // Assert
      expect(sessionService.getUser).toHaveBeenCalled();
      expect(resourceRepository.findOne).toHaveBeenCalled();
      expect(resourceRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockResource);
    });

    it('should throw BadRequestException when resource with same URL already exists', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(mockUser);
      resourceRepository.findOne.mockResolvedValue(mockResource);

      // Act & Assert
      await expect(
        resourceDomain.createNewResource(mockNewResource as Resource),
      ).rejects.toThrow(BadRequestException);
      await expect(
        resourceDomain.createNewResource(mockNewResource as Resource),
      ).rejects.toThrow('RESOURCE_ALREADY_EXISTS');

      expect(sessionService.getUser).toHaveBeenCalled();
      expect(resourceRepository.findOne).toHaveBeenCalledWith({
        where: { url: mockNewResource.url, deletedAt: null },
      });
      expect(resourceRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('inherited methods from BaseDomain', () => {
    describe('create', () => {
      it('should create a resource with proper constraints', async () => {
        // Arrange
        const resourceToCreate = { ...mockNewResource } as Resource;
        resourceRepository.create.mockResolvedValue(mockResource);

        // Act
        const result = await resourceDomain.create(resourceToCreate);

        // Assert
        expect(resourceRepository.create).toHaveBeenCalled();
        expect(result).toEqual(mockResource);
      });
    });

    describe('findPaginated', () => {
      it('should return paginated resources', async () => {
        // Arrange
        const mockPaginatedResult = {
          rows: [mockResource],
          count: 1,
        };
        resourceRepository.findAndCountAll.mockResolvedValue(
          mockPaginatedResult as any,
        );

        // Act
        const result = await resourceDomain.findPaginated({}, 1, 10);

        // Assert
        expect(resourceRepository.findAndCountAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
          limit: 10,
          offset: 0,
        });
        expect(result.data).toEqual([mockResource]);
        expect(result.pagination).toEqual({
          total: 1,
          page: 1,
          pages: 1,
        });
      });
    });

    describe('findAll', () => {
      it('should return all resources', async () => {
        // Arrange
        resourceRepository.findAll.mockResolvedValue([mockResource]);

        // Act
        const result = await resourceDomain.findAll();

        // Assert
        expect(resourceRepository.findAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
        });
        expect(result).toEqual([mockResource]);
      });
    });

    describe('findOne', () => {
      it('should return a resource when found', async () => {
        // Arrange
        resourceRepository.findOne.mockResolvedValue(mockResource);

        // Act
        const result = await resourceDomain.findOne({ id: 1 });

        // Assert
        expect(resourceRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1, deletedAt: null },
        });
        expect(result).toEqual(mockResource);
      });

      it('should return null when resource not found and emptyValue is true', async () => {
        // Arrange
        resourceRepository.findOne.mockResolvedValue(null);

        // Act
        const result = await resourceDomain.findOne({ id: 999 }, true);

        // Assert
        expect(resourceRepository.findOne).toHaveBeenCalledWith({
          where: { id: 999, deletedAt: null },
        });
        expect(result).toBeNull();
      });
    });

    describe('findByStringId', () => {
      it('should return resource by stringId', async () => {
        // Arrange
        const stringId = 'test-string-id';
        resourceRepository.findOne.mockResolvedValue(mockResource);

        // Act
        const result = await resourceDomain.findByStringId(stringId);

        // Assert
        expect(resourceRepository.findOne).toHaveBeenCalledWith({
          where: { stringId, deletedAt: null },
        });
        expect(result).toEqual(mockResource);
      });
    });

    describe('findByPk', () => {
      it('should return resource by primary key', async () => {
        // Arrange
        resourceRepository.findByPk.mockResolvedValue(mockResource);

        // Act
        const result = await resourceDomain.findByPk(1);

        // Assert
        expect(resourceRepository.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResource);
      });
    });

    describe('update', () => {
      it('should update a resource', async () => {
        // Arrange
        const updateData = {
          description: 'Updated description',
          setDataValue: jest.fn(),
          get: jest
            .fn()
            .mockReturnValue({ description: 'Updated description' }),
        } as any;
        resourceRepository.findByPk.mockResolvedValue(mockResource);
        resourceRepository.update.mockResolvedValue([1]);

        // Act
        const result = await resourceDomain.update(1, updateData);

        // Assert
        expect(resourceRepository.findByPk).toHaveBeenCalledWith(1);
        expect(resourceRepository.update).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Updated description' }),
          { where: { id: 1 } },
        );
        expect(result).toEqual(mockResource);
      });
    });

    describe('remove', () => {
      it('should soft delete a resource', async () => {
        // Arrange
        const resourceWithDeletedAt = {
          ...mockResource,
          update: jest.fn().mockResolvedValue(true),
        };
        resourceRepository.findByPk.mockResolvedValue(
          resourceWithDeletedAt as any,
        );

        // Act
        await resourceDomain.remove(1);

        // Assert
        expect(resourceRepository.findByPk).toHaveBeenCalledWith(1);
        expect(resourceWithDeletedAt.update).toHaveBeenCalledWith({
          deletedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('should hard delete a resource when destroy is true', async () => {
        // Arrange
        const resourceWithDestroy = {
          ...mockResource,
          destroy: jest.fn().mockResolvedValue(true),
          update: jest.fn().mockResolvedValue(true),
        };
        resourceRepository.findByPk.mockResolvedValue(
          resourceWithDestroy as any,
        );

        // Act
        await resourceDomain.remove(1, true);

        // Assert
        expect(resourceRepository.findByPk).toHaveBeenCalledWith(1);
        expect(resourceWithDestroy.destroy).toHaveBeenCalled();
      });
    });
  });

  describe('getEntityName', () => {
    it('should return the correct entity name', () => {
      // Act
      const entityName = (resourceDomain as any).getEntityName();

      // Assert
      expect(entityName).toBe('RESOURCE');
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(mockUser);
      resourceRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        resourceDomain.createNewResource(mockNewResource as Resource),
      ).rejects.toThrow('Database error');
    });

    it('should handle repository errors in findOne', async () => {
      // Arrange
      resourceRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(resourceDomain.findOne({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });
  });
});
