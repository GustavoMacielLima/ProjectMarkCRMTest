import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'sequelize-typescript';
import { TopicDomain } from './topic.domain';
import { SessionService } from '../../resources/services/session.service';
import { Topic } from '../../models/topic.model';
import { RepositoryProvider } from '../../repository/repository.provider';

// Mock the Topic model
jest.mock('../../models/topic.model', () => ({
  Topic: jest.fn().mockImplementation(() => ({
    name: 'Sub Topic',
    content: 'Sub topic content',
    parentTopicId: 3,
    setDataValue: jest.fn(),
    get: jest.fn().mockReturnValue({
      name: 'Sub Topic',
      content: 'Sub topic content',
      parentTopicId: 3,
    }),
  })),
}));

describe('TopicDomain', () => {
  let topicDomain: TopicDomain;
  let topicRepository: jest.Mocked<Repository<Topic>>;

  // Mock data
  const mockTopic: Topic = {
    id: 1,
    name: 'Test Topic',
    content: 'Test content for the topic',
    version: 1,
    parentTopicId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Topic;

  const mockNewTopic: Partial<Topic> = {
    name: 'New Topic',
    content: 'New topic content',
    version: 1,
    parentTopicId: null,
    setDataValue: jest.fn(),
    get: jest.fn().mockReturnValue({
      name: 'New Topic',
      content: 'New topic content',
      version: 1,
      parentTopicId: null,
    }),
  };

  const mockSubTopic: Topic = {
    id: 2,
    name: 'Sub Topic',
    content: 'Sub topic content',
    version: 1,
    parentTopicId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Topic;

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
        TopicDomain,
        {
          provide: RepositoryProvider.TOPIC,
          useValue: mockRepository,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    topicDomain = module.get<TopicDomain>(TopicDomain);
    topicRepository = module.get(RepositoryProvider.TOPIC);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewTopic', () => {
    it('should create a new topic with createdAt set', async () => {
      // Arrange
      const topicToCreate = { ...mockNewTopic } as Topic;
      const expectedTopic = {
        ...mockTopic,
        name: 'New Topic',
        content: 'New topic content',
      };
      topicRepository.create.mockResolvedValue(expectedTopic as Topic);

      // Act
      const result = await topicDomain.createNewTopic(topicToCreate);

      // Assert
      expect(topicRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedTopic);
      expect(topicToCreate.createdAt).toBeInstanceOf(Date);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const topicToCreate = { ...mockNewTopic } as Topic;
      topicRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(topicDomain.createNewTopic(topicToCreate)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateTopic', () => {
    it('should update a topic and create new subtopics', async () => {
      // Arrange
      const topicToUpdate = {
        ...mockTopic,
        version: 1,
        setDataValue: jest.fn(),
        get: jest.fn().mockReturnValue({
          name: 'Updated Topic',
          content: 'Updated content',
          version: 1,
          parentTopicId: null,
        }),
      } as any;

      const updatedTopic = {
        ...mockTopic,
        id: 3, // New ID for the updated topic
        version: 2,
      };

      const subTopics = [mockSubTopic];

      topicRepository.create
        .mockResolvedValueOnce(updatedTopic as Topic) // First call for main topic
        .mockResolvedValueOnce(mockSubTopic as Topic); // Second call for subtopic

      topicRepository.findAll.mockResolvedValue(subTopics);

      // Act
      const result = await topicDomain.updateTopic(
        topicToUpdate,
        topicToUpdate.id,
      );

      // Assert
      expect(topicRepository.findAll).toHaveBeenCalledWith({
        where: { parentTopicId: topicToUpdate.id, deletedAt: null },
      });
      expect(topicRepository.create).toHaveBeenCalledTimes(2); // Main topic + 1 subtopic
      expect(result).toEqual(updatedTopic);
      expect(topicToUpdate.version).toBe(2); // Version should be incremented
    });

    it('should update topic without subtopics when none exist', async () => {
      // Arrange
      const topicToUpdate = {
        ...mockTopic,
        version: 1,
        setDataValue: jest.fn(),
        get: jest.fn().mockReturnValue({
          name: 'Updated Topic',
          content: 'Updated content',
          version: 1,
          parentTopicId: null,
        }),
      } as any;

      const updatedTopic = {
        ...mockTopic,
        id: 3,
        version: 2,
      };

      topicRepository.create.mockResolvedValue(updatedTopic as Topic);
      topicRepository.findAll.mockResolvedValue([]); // No subtopics

      // Act
      const result = await topicDomain.updateTopic(
        topicToUpdate,
        topicToUpdate.id,
      );

      // Assert
      expect(topicRepository.findAll).toHaveBeenCalledWith({
        where: { parentTopicId: topicToUpdate.id, deletedAt: null },
      });
      expect(topicRepository.create).toHaveBeenCalledTimes(1); // Only main topic
      expect(result).toEqual(updatedTopic);
      expect(topicToUpdate.version).toBe(2);
    });

    it('should handle database errors during update', async () => {
      // Arrange
      const topicToUpdate = {
        ...mockTopic,
        version: 1,
        setDataValue: jest.fn(),
        get: jest.fn().mockReturnValue({
          name: 'Updated Topic',
          content: 'Updated content',
          version: 1,
          parentTopicId: null,
        }),
      } as any;

      topicRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        topicDomain.updateTopic(topicToUpdate, topicToUpdate.id),
      ).rejects.toThrow('Database error');
    });

    it('should handle errors when finding subtopics', async () => {
      // Arrange
      const topicToUpdate = {
        ...mockTopic,
        version: 1,
        setDataValue: jest.fn(),
        get: jest.fn().mockReturnValue({
          name: 'Updated Topic',
          content: 'Updated content',
          version: 1,
          parentTopicId: null,
        }),
      } as any;

      topicRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        topicDomain.updateTopic(topicToUpdate, topicToUpdate.id),
      ).rejects.toThrow('Database error');
    });
  });

  describe('inherited methods from BaseDomain', () => {
    describe('create', () => {
      it('should create a topic with proper constraints', async () => {
        // Arrange
        const topicToCreate = { ...mockNewTopic } as Topic;
        topicRepository.create.mockResolvedValue(mockTopic);

        // Act
        const result = await topicDomain.create(topicToCreate);

        // Assert
        expect(topicRepository.create).toHaveBeenCalled();
        expect(result).toEqual(mockTopic);
      });
    });

    describe('findPaginated', () => {
      it('should return paginated topics', async () => {
        // Arrange
        const mockPaginatedResult = {
          rows: [mockTopic],
          count: 1,
        };
        topicRepository.findAndCountAll.mockResolvedValue(
          mockPaginatedResult as any,
        );

        // Act
        const result = await topicDomain.findPaginated({}, 1, 10);

        // Assert
        expect(topicRepository.findAndCountAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
          limit: 10,
          offset: 0,
        });
        expect(result.data).toEqual([mockTopic]);
        expect(result.pagination).toEqual({
          total: 1,
          page: 1,
          pages: 1,
        });
      });
    });

    describe('findAll', () => {
      it('should return all topics', async () => {
        // Arrange
        topicRepository.findAll.mockResolvedValue([mockTopic]);

        // Act
        const result = await topicDomain.findAll();

        // Assert
        expect(topicRepository.findAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
        });
        expect(result).toEqual([mockTopic]);
      });
    });

    describe('findOne', () => {
      it('should return a topic when found', async () => {
        // Arrange
        topicRepository.findOne.mockResolvedValue(mockTopic);

        // Act
        const result = await topicDomain.findOne({ id: 1 });

        // Assert
        expect(topicRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1, deletedAt: null },
        });
        expect(result).toEqual(mockTopic);
      });

      it('should return null when topic not found and emptyValue is true', async () => {
        // Arrange
        topicRepository.findOne.mockResolvedValue(null);

        // Act
        const result = await topicDomain.findOne({ id: 999 }, true);

        // Assert
        expect(topicRepository.findOne).toHaveBeenCalledWith({
          where: { id: 999, deletedAt: null },
        });
        expect(result).toBeNull();
      });
    });

    describe('findByStringId', () => {
      it('should return topic by stringId', async () => {
        // Arrange
        const stringId = 'test-string-id';
        topicRepository.findOne.mockResolvedValue(mockTopic);

        // Act
        const result = await topicDomain.findByStringId(stringId);

        // Assert
        expect(topicRepository.findOne).toHaveBeenCalledWith({
          where: { stringId, deletedAt: null },
        });
        expect(result).toEqual(mockTopic);
      });
    });

    describe('findByPk', () => {
      it('should return topic by primary key', async () => {
        // Arrange
        topicRepository.findByPk.mockResolvedValue(mockTopic);

        // Act
        const result = await topicDomain.findByPk(1);

        // Assert
        expect(topicRepository.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockTopic);
      });
    });

    describe('update', () => {
      it('should update a topic', async () => {
        // Arrange
        const updateData = {
          name: 'Updated Topic Name',
          setDataValue: jest.fn(),
          get: jest.fn().mockReturnValue({ name: 'Updated Topic Name' }),
        } as any;
        topicRepository.findByPk.mockResolvedValue(mockTopic);
        topicRepository.update.mockResolvedValue([1]);

        // Act
        const result = await topicDomain.update(1, updateData);

        // Assert
        expect(topicRepository.findByPk).toHaveBeenCalledWith(1);
        expect(topicRepository.update).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Updated Topic Name' }),
          { where: { id: 1 } },
        );
        expect(result).toEqual(mockTopic);
      });
    });

    describe('remove', () => {
      it('should soft delete a topic', async () => {
        // Arrange
        const topicWithDeletedAt = {
          ...mockTopic,
          update: jest.fn().mockResolvedValue(true),
        };
        topicRepository.findByPk.mockResolvedValue(topicWithDeletedAt as any);

        // Act
        await topicDomain.remove(1);

        // Assert
        expect(topicRepository.findByPk).toHaveBeenCalledWith(1);
        expect(topicWithDeletedAt.update).toHaveBeenCalledWith({
          deletedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('should hard delete a topic when destroy is true', async () => {
        // Arrange
        const topicWithDestroy = {
          ...mockTopic,
          destroy: jest.fn().mockResolvedValue(true),
          update: jest.fn().mockResolvedValue(true),
        };
        topicRepository.findByPk.mockResolvedValue(topicWithDestroy as any);

        // Act
        await topicDomain.remove(1, true);

        // Assert
        expect(topicRepository.findByPk).toHaveBeenCalledWith(1);
        expect(topicWithDestroy.destroy).toHaveBeenCalled();
      });
    });
  });

  describe('getEntityName', () => {
    it('should return the correct entity name', () => {
      // Act
      const entityName = (topicDomain as any).getEntityName();

      // Assert
      expect(entityName).toBe('TOPIC');
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      topicRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(topicDomain.findOne({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle repository errors in findOne', async () => {
      // Arrange
      topicRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(topicDomain.findOne({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });
  });
});
