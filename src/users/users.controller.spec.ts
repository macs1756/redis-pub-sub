// src/users/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return UserDto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const user = {
        user_id: 1,
        email: createUserDto.email,
        password_hash: 'hashedpassword',
        username: createUserDto.username,
        avatar_url: null,
        bio: null,
        timezone: 'UTC',
        language: 'en',
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true,
        last_login: null,
      };

      mockUsersService.createUser.mockResolvedValue(user);

      const result = await controller.register(createUserDto);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ ...user, password_hash: undefined });
    });

    it('should throw ConflictException if email or username already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      mockUsersService.createUser.mockRejectedValue(
        new ConflictException('Email or username already exists'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: { user_id: 1 } };
      const user = {
        user_id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        username: 'testuser',
        avatar_url: null,
        bio: null,
        timezone: 'UTC',
        language: 'en',
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true,
        last_login: null,
      };

      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.getProfile(req);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ ...user, password_hash: undefined });
    });

    it('should throw NotFoundException if user not found', async () => {
      const req = { user: { user_id: 999 } };
      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.getProfile(req)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findById).toHaveBeenCalledWith(999);
    });
  });
});
