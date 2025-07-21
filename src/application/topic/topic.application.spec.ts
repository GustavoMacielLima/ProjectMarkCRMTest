import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TopicApplication } from './topic.application';
import { TopicDomain } from '../../domain/topic/topic.domain';
import { Topic } from '../../models/topic.model';
import { CreateTopicDto } from '../../modules/topic/dto/create-topic.dto';
import { UpdateTopicDto } from '../../modules/topic/dto/update-topic.dto';

// Mock Topic model
jest.mock('../../models/topic.model');

describe('TopicApplication', () => {
  let topicApplication: TopicApplication;
  let topicDomain: jest.Mocked<TopicDomain>;

  // Mock data
  const mockTopic: Topic = {
    id: 1,
    name: 'Test Topic',
    content: 'Test Content',
    parentTopicId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    version: 1,
  } as Topic;

  const mockSubTopic: Topic = {
    id: 2,
    name: 'Sub Topic',
    content: 'Sub Content',
    parentTopicId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    version: 1,
  } as Topic;

  const mockCreateTopicDto: CreateTopicDto = {
    name: 'New Topic',
    content: 'New Content',
    parentTopicId: null,
  };

  const mockUpdateTopicDto: UpdateTopicDto = {
    name: 'Updated Topic',
    content: 'Updated Content',
    parentTopicId: null,
  };

  beforeEach(async () => {
    // Mock Topic constructor
    (Topic as jest.MockedClass<typeof Topic>).mockImplementation(
      () => mockTopic as any,
    );

    // Create mocks
    const mockTopicDomain = {
      createNewTopic: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      updateTopic: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicApplication,
        {
          provide: TopicDomain,
          useValue: mockTopicDomain,
        },
      ],
    }).compile();

    topicApplication = module.get<TopicApplication>(TopicApplication);
    topicDomain = module.get(TopicDomain);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new topic successfully', async () => {
      // Arrange
      topicDomain.createNewTopic.mockResolvedValue(mockTopic);

      // Act
      const result = await topicApplication.create(mockCreateTopicDto);

      // Assert
      expect(topicDomain.createNewTopic).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateTopicDto.name,
          content: mockCreateTopicDto.content,
          parentTopicId: mockCreateTopicDto.parentTopicId,
          version: 1,
        }),
      );
      expect(result).toEqual(mockTopic);
    });

    it('should handle domain errors during creation', async () => {
      // Arrange
      topicDomain.createNewTopic.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(topicApplication.create(mockCreateTopicDto)).rejects.toThrow(
        'Domain error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all topics', async () => {
      // Arrange
      const mockTopics = [mockTopic];
      topicDomain.findAll.mockResolvedValue(mockTopics);

      // Act
      const result = await topicApplication.findAll();

      // Assert
      expect(topicDomain.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTopics);
    });

    it('should handle domain errors when finding all topics', async () => {
      // Arrange
      topicDomain.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(topicApplication.findAll()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return topic when found by id', async () => {
      // Arrange
      const topicId = 1;
      topicDomain.findByPk.mockResolvedValue(mockTopic);

      // Act
      const result = await topicApplication.findOne(topicId);

      // Assert
      expect(topicDomain.findByPk).toHaveBeenCalledWith(topicId);
      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException when topic not found by id', async () => {
      // Arrange
      const topicId = 999;
      topicDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(topicApplication.findOne(topicId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topicApplication.findOne(topicId)).rejects.toThrow(
        'TOPIC_NOT_FOUND',
      );
    });

    it('should handle domain errors when finding topic by id', async () => {
      // Arrange
      const topicId = 1;
      topicDomain.findByPk.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(topicApplication.findOne(topicId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAllSubTopics', () => {
    it('should return all subtopics for a parent topic', async () => {
      // Arrange
      const parentTopicId = 1;
      const mockSubTopics = [mockSubTopic];
      topicDomain.findAll.mockResolvedValue(mockSubTopics);

      // Act
      const result = await topicApplication.findAllSubTopics(parentTopicId);

      // Assert
      expect(topicDomain.findAll).toHaveBeenCalledWith({ parentTopicId });
      expect(result).toEqual(mockSubTopics);
    });
  });

  describe('findAllTopicsWithSubTopics', () => {
    it('should return topics with their subtopics', async () => {
      // Arrange
      const topics = [mockTopic];
      const subTopics = [mockSubTopic];
      topicDomain.findAll.mockImplementation((query?: any) => {
        if (query && query.parentTopicId) {
          return Promise.resolve(subTopics);
        }
        return Promise.resolve(topics);
      });

      // Act
      const result = await topicApplication.findAllTopicsWithSubTopics(topics);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].id).toBe(mockTopic.id);
      expect(result[0].subTopics[0].id).toBe(mockSubTopic.id);
    });
  });

  describe('update', () => {
    it('should update topic successfully', async () => {
      // Arrange
      const topicId = 1;
      const updatedTopic = { ...mockTopic, ...mockUpdateTopicDto };
      topicDomain.findByPk.mockResolvedValue(mockTopic);
      topicDomain.updateTopic.mockResolvedValue(updatedTopic as any);

      // Act
      const result = await topicApplication.update(topicId, mockUpdateTopicDto);

      // Assert
      expect(topicDomain.findByPk).toHaveBeenCalledWith(topicId);
      expect(topicDomain.updateTopic).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockUpdateTopicDto.name,
          content: mockUpdateTopicDto.content,
          version: mockTopic.version,
        }),
        topicId,
      );
      expect(result).toEqual(updatedTopic);
    });

    it('should throw NotFoundException when topic not found for update', async () => {
      // Arrange
      const topicId = 999;
      topicDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(
        topicApplication.update(topicId, mockUpdateTopicDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        topicApplication.update(topicId, mockUpdateTopicDto),
      ).rejects.toThrow('TOPIC_NOT_FOUND');
    });

    it('should handle domain errors during update', async () => {
      // Arrange
      const topicId = 1;
      topicDomain.findByPk.mockResolvedValue(mockTopic);
      topicDomain.updateTopic.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(
        topicApplication.update(topicId, mockUpdateTopicDto),
      ).rejects.toThrow('Update error');
    });
  });

  describe('remove', () => {
    it('should remove topic successfully', async () => {
      // Arrange
      const topicId = 1;
      topicDomain.findByPk.mockResolvedValue(mockTopic);
      topicDomain.remove.mockResolvedValue(undefined);

      // Act
      await topicApplication.remove(topicId);

      // Assert
      expect(topicDomain.findByPk).toHaveBeenCalledWith(topicId);
      expect(topicDomain.remove).toHaveBeenCalledWith(mockTopic.id);
    });

    it('should throw NotFoundException when topic not found for removal', async () => {
      // Arrange
      const topicId = 999;
      topicDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(topicApplication.remove(topicId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topicApplication.remove(topicId)).rejects.toThrow(
        'TOPIC_NOT_FOUND',
      );
    });

    it('should handle domain errors during removal', async () => {
      // Arrange
      const topicId = 1;
      topicDomain.findByPk.mockResolvedValue(mockTopic);
      topicDomain.remove.mockImplementation(() => {
        throw new Error('Remove error');
      });

      // Act & Assert
      await expect(topicApplication.remove(topicId)).rejects.toThrow(
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
        topicDomain.createNewTopic.mockRejectedValue(new Error(error.message));

        // Act & Assert
        await expect(
          topicApplication.create(mockCreateTopicDto),
        ).rejects.toThrow(error.message);
      }
    });
  });

  describe('data transformation', () => {
    it('should properly transform CreateTopicDto to Topic entity', async () => {
      // Arrange
      topicDomain.createNewTopic.mockResolvedValue(mockTopic);

      // Act
      const result = await topicApplication.create(mockCreateTopicDto);

      // Assert
      expect(topicDomain.createNewTopic).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateTopicDto.name,
          content: mockCreateTopicDto.content,
          parentTopicId: mockCreateTopicDto.parentTopicId,
          version: 1,
        }),
      );
      expect(result).toEqual(mockTopic);
    });

    it('should properly merge UpdateTopicDto with existing topic', async () => {
      // Arrange
      const topicId = 1;
      const updatedTopic = { ...mockTopic, ...mockUpdateTopicDto };
      topicDomain.findByPk.mockResolvedValue(mockTopic);
      topicDomain.updateTopic.mockResolvedValue(updatedTopic as any);

      // Act
      const result = await topicApplication.update(topicId, mockUpdateTopicDto);

      // Assert
      expect(result).toEqual(updatedTopic);
      expect(result.name).toBe(mockUpdateTopicDto.name);
      expect(result.content).toBe(mockUpdateTopicDto.content);
    });
  });
});
