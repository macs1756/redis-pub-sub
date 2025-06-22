// src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const user = new User();
      user.email = createUserDto.email;
      user.password_hash = createUserDto.password;
      user.username = createUserDto.username;

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.createUser(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password_hash: createUserDto.password,
        username: createUserDto.username,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw ConflictException if email or username already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const user = new User();
      user.email = createUserDto.email;
      user.password_hash = createUserDto.password;
      user.username = createUserDto.username;

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockRejectedValue({ code: '23505' }); // Unique violation

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const user = new User();
      user.email = createUserDto.email;
      user.password_hash = createUserDto.password;
      user.username = createUserDto.username;

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockRejectedValue({ code: '12345' }); // Some other error

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail(email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      const email = 'nonexistent@example.com';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findByEmail(email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user_id = 1;
      const user = new User();
      user.user_id = user_id;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(user_id);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const user_id = 999;
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findById(user_id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id },
      });
    });
  });
});
