import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';
import { UserDomain } from './user.domain';
import { SessionService } from '../../resources/services/session.service';
import { User, UserRole } from '../../models/user.model';
import { RepositoryProvider } from '../../repository/repository.provider';

describe('UserDomain', () => {
  let userDomain: UserDomain;
  let userRepository: jest.Mocked<Repository<User>>;

  // Mock data
  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as User;

  const mockNewUser: Partial<User> = {
    name: 'New User',
    email: 'newuser@example.com',
    role: UserRole.EDITOR,
    setDataValue: jest.fn(),
    get: jest.fn().mockReturnValue({
      name: 'New User',
      email: 'newuser@example.com',
      role: UserRole.EDITOR,
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
        UserDomain,
        {
          provide: RepositoryProvider.USER,
          useValue: mockRepository,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    userDomain = module.get<UserDomain>(UserDomain);
    userRepository = module.get(RepositoryProvider.USER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // Arrange
      const email = 'test@example.com';
      userRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await userDomain.findByEmail(email);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(userDomain.findByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userDomain.findByEmail(email)).rejects.toThrow(
        'USER_NOT_FOUND',
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const email = 'test@example.com';
      userRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(userDomain.findByEmail(email)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('inherited methods from BaseDomain', () => {
    describe('create', () => {
      it('should create a user with proper constraints', async () => {
        // Arrange
        const userToCreate = { ...mockNewUser } as User;
        userRepository.create.mockResolvedValue(mockUser);

        // Act
        const result = await userDomain.create(userToCreate);

        // Assert
        expect(userRepository.create).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
      });
    });

    describe('findPaginated', () => {
      it('should return paginated users', async () => {
        // Arrange
        const mockPaginatedResult = {
          rows: [mockUser],
          count: 1,
        };
        userRepository.findAndCountAll.mockResolvedValue(
          mockPaginatedResult as any,
        );

        // Act
        const result = await userDomain.findPaginated({}, 1, 10);

        // Assert
        expect(userRepository.findAndCountAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
          limit: 10,
          offset: 0,
        });
        expect(result.data).toEqual([mockUser]);
        expect(result.pagination).toEqual({
          total: 1,
          page: 1,
          pages: 1,
        });
      });
    });

    describe('findAll', () => {
      it('should return all users', async () => {
        // Arrange
        userRepository.findAll.mockResolvedValue([mockUser]);

        // Act
        const result = await userDomain.findAll();

        // Assert
        expect(userRepository.findAll).toHaveBeenCalledWith({
          where: { deletedAt: null },
        });
        expect(result).toEqual([mockUser]);
      });
    });

    describe('findOne', () => {
      it('should return a user when found', async () => {
        // Arrange
        userRepository.findOne.mockResolvedValue(mockUser);

        // Act
        const result = await userDomain.findOne({ id: 1 });

        // Assert
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1, deletedAt: null },
        });
        expect(result).toEqual(mockUser);
      });

      it('should return null when user not found and emptyValue is true', async () => {
        // Arrange
        userRepository.findOne.mockResolvedValue(null);

        // Act
        const result = await userDomain.findOne({ id: 999 }, true);

        // Assert
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: 999, deletedAt: null },
        });
        expect(result).toBeNull();
      });
    });

    describe('findByStringId', () => {
      it('should return user by stringId', async () => {
        // Arrange
        const stringId = 'test-string-id';
        userRepository.findOne.mockResolvedValue(mockUser);

        // Act
        const result = await userDomain.findByStringId(stringId);

        // Assert
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { stringId, deletedAt: null },
        });
        expect(result).toEqual(mockUser);
      });
    });

    describe('findByPk', () => {
      it('should return user by primary key', async () => {
        // Arrange
        userRepository.findByPk.mockResolvedValue(mockUser);

        // Act
        const result = await userDomain.findByPk(1);

        // Assert
        expect(userRepository.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
      });
    });

    describe('update', () => {
      it('should update a user', async () => {
        // Arrange
        const updateData = {
          name: 'Updated User Name',
          setDataValue: jest.fn(),
          get: jest.fn().mockReturnValue({ name: 'Updated User Name' }),
        } as any;
        userRepository.findByPk.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue([1]);

        // Act
        const result = await userDomain.update(1, updateData);

        // Assert
        expect(userRepository.findByPk).toHaveBeenCalledWith(1);
        expect(userRepository.update).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Updated User Name' }),
          { where: { id: 1 } },
        );
        expect(result).toEqual(mockUser);
      });
    });

    describe('remove', () => {
      it('should soft delete a user', async () => {
        // Arrange
        const userWithDeletedAt = {
          ...mockUser,
          update: jest.fn().mockResolvedValue(true),
        };
        userRepository.findByPk.mockResolvedValue(userWithDeletedAt as any);

        // Act
        await userDomain.remove(1);

        // Assert
        expect(userRepository.findByPk).toHaveBeenCalledWith(1);
        expect(userWithDeletedAt.update).toHaveBeenCalledWith({
          deletedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('should hard delete a user when destroy is true', async () => {
        // Arrange
        const userWithDestroy = {
          ...mockUser,
          destroy: jest.fn().mockResolvedValue(true),
          update: jest.fn().mockResolvedValue(true),
        };
        userRepository.findByPk.mockResolvedValue(userWithDestroy as any);

        // Act
        await userDomain.remove(1, true);

        // Assert
        expect(userRepository.findByPk).toHaveBeenCalledWith(1);
        expect(userWithDestroy.destroy).toHaveBeenCalled();
      });
    });
  });

  describe('getEntityName', () => {
    it('should return the correct entity name', () => {
      // Act
      const entityName = (userDomain as any).getEntityName();

      // Assert
      expect(entityName).toBe('USER');
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      userRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(userDomain.findOne({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle repository errors in findOne', async () => {
      // Arrange
      userRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(userDomain.findOne({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('user role scenarios', () => {
    it('should handle different user roles correctly', async () => {
      // Arrange
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const editorUser = { ...mockUser, role: UserRole.EDITOR };
      const viewerUser = { ...mockUser, role: UserRole.VIEWER };

      userRepository.findOne
        .mockResolvedValueOnce(adminUser as User)
        .mockResolvedValueOnce(editorUser as User)
        .mockResolvedValueOnce(viewerUser as User);

      // Act & Assert
      const adminResult = await userDomain.findByEmail('admin@example.com');
      expect(adminResult.role).toBe(UserRole.ADMIN);

      const editorResult = await userDomain.findByEmail('editor@example.com');
      expect(editorResult.role).toBe(UserRole.EDITOR);

      const viewerResult = await userDomain.findByEmail('viewer@example.com');
      expect(viewerResult.role).toBe(UserRole.VIEWER);
    });
  });

  describe('email validation scenarios', () => {
    it('should handle various email formats', async () => {
      // Arrange
      const testEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@subdomain.example.com',
      ];

      for (const email of testEmails) {
        userRepository.findOne.mockResolvedValue({
          ...mockUser,
          email,
        } as User);

        // Act
        const result = await userDomain.findByEmail(email);

        // Assert
        expect(result.email).toBe(email);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email },
        });
      }
    });

    it('should handle case-sensitive email search', async () => {
      // Arrange
      const email = 'User@Example.com';
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        email: 'user@example.com',
      } as User);

      // Act
      const result = await userDomain.findByEmail(email);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeDefined();
    });
  });
});
