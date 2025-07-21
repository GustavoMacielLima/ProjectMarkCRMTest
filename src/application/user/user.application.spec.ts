import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserApplication } from './user.application';
import { UserDomain } from '../../domain/user/user.domain';
import { SessionService } from '../../resources/services/session.service';
import { User, UserRole } from '../../models/user.model';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/user/dto/update-user.dto';

// Mock User model
jest.mock('../../models/user.model');

describe('UserApplication', () => {
  let userApplication: UserApplication;
  let userDomain: jest.Mocked<UserDomain>;
  let sessionService: jest.Mocked<SessionService>;

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

  const mockCreateUserDto: CreateUserDto = {
    name: 'New User',
    email: 'newuser@example.com',
    role: UserRole.EDITOR,
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Updated User',
    email: 'updated@example.com',
  };

  beforeEach(async () => {
    // Mock User constructor
    (User as jest.MockedClass<typeof User>).mockImplementation(
      () => mockUser as any,
    );

    // Create mocks
    const mockUserDomain = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockSessionService = {
      getUser: jest.fn(),
      setUser: jest.fn(),
      clearUser: jest.fn(),
      clearSession: jest.fn(),
      isAuthenticated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserApplication,
        {
          provide: UserDomain,
          useValue: mockUserDomain,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    userApplication = module.get<UserApplication>(UserApplication);
    userDomain = module.get(UserDomain);
    sessionService = module.get(SessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      userDomain.create.mockResolvedValue(mockUser);

      // Act
      const result = await userApplication.create(mockCreateUserDto);

      // Assert
      expect(userDomain.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
          role: mockCreateUserDto.role,
        }),
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle domain errors during creation', async () => {
      // Arrange
      userDomain.create.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(userApplication.create(mockCreateUserDto)).rejects.toThrow(
        'Domain error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [mockUser];
      userDomain.findAll.mockResolvedValue(users);

      // Act
      const result = await userApplication.findAll();

      // Assert
      expect(userDomain.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should handle domain errors when finding all users', async () => {
      // Arrange
      userDomain.findAll.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(userApplication.findAll()).rejects.toThrow('Domain error');
    });
  });

  describe('findOne', () => {
    it('should return user when found by id', async () => {
      // Arrange
      const id = 1;
      userDomain.findByPk.mockResolvedValue(mockUser);

      // Act
      const result = await userApplication.findOne(id);

      // Assert
      expect(userDomain.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found by id', async () => {
      // Arrange
      const id = 999;
      userDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(userApplication.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userApplication.findOne(id)).rejects.toThrow(
        'USER_NOT_FOUND',
      );
    });

    it('should handle domain errors when finding user by id', async () => {
      // Arrange
      const id = 1;
      userDomain.findByPk.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(userApplication.findOne(id)).rejects.toThrow('Domain error');
    });
  });

  describe('myself', () => {
    it('should return the logged user from session', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(mockUser);

      // Act
      const result = await userApplication.myself();

      // Assert
      expect(sessionService.getUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is logged in', async () => {
      // Arrange
      sessionService.getUser.mockReturnValue(null);

      // Act
      const result = await userApplication.myself();

      // Assert
      expect(sessionService.getUser).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // Arrange
      const email = 'test@example.com';
      userDomain.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await userApplication.findByEmail(email);

      // Assert
      expect(userDomain.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      userDomain.findByEmail.mockRejectedValue(
        new NotFoundException('USER_NOT_FOUND'),
      );

      // Act & Assert
      await expect(userApplication.findByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userApplication.findByEmail(email)).rejects.toThrow(
        'USER_NOT_FOUND',
      );
    });

    it('should handle domain errors when finding user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      userDomain.findByEmail.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(userApplication.findByEmail(email)).rejects.toThrow(
        'Domain error',
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const id = 1;
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      userDomain.findByPk.mockResolvedValue(mockUser);
      userDomain.update.mockResolvedValue(updatedUser as any);

      // Act
      const result = await userApplication.update(id, mockUpdateUserDto);

      // Assert
      expect(userDomain.findByPk).toHaveBeenCalledWith(id);
      expect(userDomain.update).toHaveBeenCalledWith(
        mockUser.id,
        updatedUser as any,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found for update', async () => {
      // Arrange
      const id = 999;
      userDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userApplication.update(id, mockUpdateUserDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        userApplication.update(id, mockUpdateUserDto),
      ).rejects.toThrow('USER_NOT_FOUND');
    });

    it('should handle domain errors during update', async () => {
      // Arrange
      const id = 1;
      userDomain.findByPk.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(
        userApplication.update(id, mockUpdateUserDto),
      ).rejects.toThrow('Domain error');
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      // Arrange
      const id = 1;
      userDomain.findByPk.mockResolvedValue(mockUser);
      userDomain.remove.mockResolvedValue(undefined);

      // Act
      await userApplication.remove(id);

      // Assert
      expect(userDomain.findByPk).toHaveBeenCalledWith(id);
      expect(userDomain.remove).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException when user not found for removal', async () => {
      // Arrange
      const id = 999;
      userDomain.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(userApplication.remove(id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(userApplication.remove(id)).rejects.toThrow(
        'USER_NOT_FOUND',
      );
    });

    it('should handle domain errors during removal', async () => {
      // Arrange
      const id = 1;
      userDomain.findByPk.mockRejectedValue(new Error('Domain error'));

      // Act & Assert
      await expect(userApplication.remove(id)).rejects.toThrow('Domain error');
    });
  });

  describe('error handling', () => {
    it('should handle various types of domain errors', async () => {
      // Arrange
      const errors = [
        new Error('Database connection failed'),
        new Error('Validation error'),
        new Error('Permission denied'),
      ];

      for (const error of errors) {
        userDomain.create.mockRejectedValue(error);

        // Act & Assert
        await expect(userApplication.create(mockCreateUserDto)).rejects.toThrow(
          error.message,
        );
      }
    });
  });

  describe('data transformation', () => {
    it('should properly transform CreateUserDto to User entity', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.VIEWER,
      };
      userDomain.create.mockResolvedValue(mockUser);

      // Act
      await userApplication.create(createDto);

      // Assert
      expect(userDomain.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createDto.name,
          email: createDto.email,
          role: createDto.role,
        }),
      );
    });

    it('should properly merge UpdateUserDto with existing user', async () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
        role: UserRole.ADMIN,
      };
      const existingUser = { ...mockUser };
      const expectedUpdatedUser = { ...existingUser, ...updateDto };

      userDomain.findByPk.mockResolvedValue(existingUser as any);
      userDomain.update.mockResolvedValue(expectedUpdatedUser as any);

      // Act
      const result = await userApplication.update(id, updateDto);

      // Assert
      expect(userDomain.update).toHaveBeenCalledWith(
        existingUser.id,
        expectedUpdatedUser as any,
      );
      expect(result).toEqual(expectedUpdatedUser);
    });
  });
});
