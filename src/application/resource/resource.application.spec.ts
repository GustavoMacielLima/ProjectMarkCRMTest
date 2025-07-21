import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ResourceApplication } from './resource.application';
import { ResourceDomain } from '../../domain/resource/resource.domain';
import { Resource, ResourceType } from '../../models/resource.model';
import { CreateResourceDto } from '../../modules/resource/dto/create-resource.dto';
import { UpdateResourceDto } from '../../modules/resource/dto/update-resource.dto';

// Mock Resource model
jest.mock('../../models/resource.model');

describe('ResourceApplication', () => {
  let resourceApplication: ResourceApplication;
  let resourceDomain: jest.Mocked<ResourceDomain>;

  // Mock data
  const mockResource: Resource = {
    id: 1,
    topicId: 1,
    type: ResourceType.ARTICLE,
    url: 'https://example.com',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Resource;

  const mockCreateResourceDto: CreateResourceDto = {
    type: ResourceType.VIDEO,
    url: 'https://newresource.com',
    description: 'New Description',
    topicId: 1,
  };

  const mockUpdateResourceDto: UpdateResourceDto = {
    description: 'Updated Description',
    url: 'https://updatedresource.com',
  };

  beforeEach(async () => {
    // Mock Resource constructor
    (Resource as jest.MockedClass<typeof Resource>).mockImplementation(
      () => mockResource as any,
    );

    // Create mocks
    const mockResourceDomain = {
      createNewResource: jest.fn(),
      findAll: jest.fn(),
      findByStringId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceApplication,
        {
          provide: ResourceDomain,
          useValue: mockResourceDomain,
        },
      ],
    }).compile();

    resourceApplication = module.get<ResourceApplication>(ResourceApplication);
    resourceDomain = module.get(ResourceDomain);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new resource successfully', async () => {
      // Arrange
      resourceDomain.createNewResource.mockResolvedValue(mockResource);

      // Act
      const result = await resourceApplication.create(mockCreateResourceDto);

      // Assert
      expect(resourceDomain.createNewResource).toHaveBeenCalledWith(
        expect.objectContaining({
          description: mockCreateResourceDto.description,
          url: mockCreateResourceDto.url,
          type: mockCreateResourceDto.type,
          topicId: mockCreateResourceDto.topicId,
        }),
      );
      expect(result).toEqual(mockResource);
    });

    it('should handle domain errors during creation', async () => {
      // Arrange
      resourceDomain.createNewResource.mockRejectedValue(
        new Error('Domain error'),
      );

      // Act & Assert
      await expect(
        resourceApplication.create(mockCreateResourceDto),
      ).rejects.toThrow('Domain error');
    });
  });

  describe('findAll', () => {
    it('should return all resources', async () => {
      // Arrange
      const mockResources = [mockResource];
      resourceDomain.findAll.mockResolvedValue(mockResources);

      // Act
      const result = await resourceApplication.findAll();

      // Assert
      expect(resourceDomain.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResources);
    });

    it('should handle domain errors when finding all resources', async () => {
      // Arrange
      resourceDomain.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(resourceApplication.findAll()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return resource when found by stringId', async () => {
      // Arrange
      const resourceId = '1';
      resourceDomain.findByStringId.mockResolvedValue(mockResource);

      // Act
      const result = await resourceApplication.findOne(resourceId);

      // Assert
      expect(resourceDomain.findByStringId).toHaveBeenCalledWith(resourceId);
      expect(result).toEqual(mockResource);
    });

    it('should throw NotFoundException when resource not found by stringId', async () => {
      // Arrange
      const resourceId = '999';
      resourceDomain.findByStringId.mockResolvedValue(null);

      // Act & Assert
      await expect(resourceApplication.findOne(resourceId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resourceApplication.findOne(resourceId)).rejects.toThrow(
        'RESOURCE_NOT_FOUND',
      );
    });

    it('should handle domain errors when finding resource by stringId', async () => {
      // Arrange
      const resourceId = '1';
      resourceDomain.findByStringId.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(resourceApplication.findOne(resourceId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update resource successfully', async () => {
      // Arrange
      const resourceId = '1';
      const updatedResource = { ...mockResource, ...mockUpdateResourceDto };
      resourceDomain.findByStringId.mockResolvedValue(mockResource);
      resourceDomain.update.mockResolvedValue(updatedResource as any);

      // Act
      const result = await resourceApplication.update(
        resourceId,
        mockUpdateResourceDto,
      );

      // Assert
      expect(resourceDomain.findByStringId).toHaveBeenCalledWith(resourceId);
      expect(resourceDomain.update).toHaveBeenCalledWith(
        mockResource.id,
        updatedResource,
      );
      expect(result).toEqual(updatedResource);
    });

    it('should throw NotFoundException when resource not found for update', async () => {
      // Arrange
      const resourceId = '999';
      resourceDomain.findByStringId.mockResolvedValue(null);

      // Act & Assert
      await expect(
        resourceApplication.update(resourceId, mockUpdateResourceDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        resourceApplication.update(resourceId, mockUpdateResourceDto),
      ).rejects.toThrow('RESOURCE_NOT_FOUND');
    });

    it('should handle domain errors during update', async () => {
      // Arrange
      const resourceId = '1';
      resourceDomain.findByStringId.mockResolvedValue(mockResource);
      resourceDomain.update.mockImplementation(() => {
        throw new Error('Update error');
      });

      // Act & Assert
      await expect(
        resourceApplication.update(resourceId, mockUpdateResourceDto),
      ).rejects.toThrow('Update error');
    });
  });

  describe('remove', () => {
    it('should remove resource successfully', async () => {
      // Arrange
      const resourceId = '1';
      resourceDomain.findByStringId.mockResolvedValue(mockResource);
      resourceDomain.remove.mockResolvedValue(undefined);

      // Act
      await resourceApplication.remove(resourceId);

      // Assert
      expect(resourceDomain.findByStringId).toHaveBeenCalledWith(resourceId);
      expect(resourceDomain.remove).toHaveBeenCalledWith(mockResource.id);
    });

    it('should throw NotFoundException when resource not found for removal', async () => {
      // Arrange
      const resourceId = '999';
      resourceDomain.findByStringId.mockResolvedValue(null);

      // Act & Assert
      await expect(resourceApplication.remove(resourceId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resourceApplication.remove(resourceId)).rejects.toThrow(
        'RESOURCE_NOT_FOUND',
      );
    });

    it('should handle domain errors during removal', async () => {
      // Arrange
      const resourceId = '1';
      resourceDomain.findByStringId.mockResolvedValue(mockResource);
      resourceDomain.remove.mockImplementation(() => {
        throw new Error('Remove error');
      });

      // Act & Assert
      await expect(resourceApplication.remove(resourceId)).rejects.toThrow(
        'Remove error',
      );
    });
  });

  describe('error handling', () => {
    it('should handle various types of domain errors', async () => {
      // Arrange
      const errors = [
        { message: 'Database connection failed', type: 'ConnectionError' },
        { message: 'Validation failed', type: 'ValidationError' },
        { message: 'Permission denied', type: 'AuthorizationError' },
      ];

      for (const error of errors) {
        resourceDomain.createNewResource.mockRejectedValue(
          new Error(error.message),
        );

        // Act & Assert
        await expect(
          resourceApplication.create(mockCreateResourceDto),
        ).rejects.toThrow(error.message);
      }
    });
  });

  describe('data transformation', () => {
    it('should properly transform CreateResourceDto to Resource entity', async () => {
      // Arrange
      resourceDomain.createNewResource.mockResolvedValue(mockResource);

      // Act
      const result = await resourceApplication.create(mockCreateResourceDto);

      // Assert
      expect(resourceDomain.createNewResource).toHaveBeenCalledWith(
        expect.objectContaining({
          description: mockCreateResourceDto.description,
          url: mockCreateResourceDto.url,
          type: mockCreateResourceDto.type,
          topicId: mockCreateResourceDto.topicId,
        }),
      );
      expect(result).toEqual(mockResource);
    });

    it('should properly merge UpdateResourceDto with existing resource', async () => {
      // Arrange
      const resourceId = '1';
      const updatedResource = { ...mockResource, ...mockUpdateResourceDto };
      resourceDomain.findByStringId.mockResolvedValue(mockResource);
      resourceDomain.update.mockResolvedValue(updatedResource as any);

      // Act
      const result = await resourceApplication.update(
        resourceId,
        mockUpdateResourceDto,
      );

      // Assert
      expect(result).toEqual(updatedResource);
      expect(result.description).toBe(mockUpdateResourceDto.description);
      expect(result.url).toBe(mockUpdateResourceDto.url);
    });
  });
});
