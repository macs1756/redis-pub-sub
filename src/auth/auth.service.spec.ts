// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = new User();
      user.email = 'test@example.com';
      user.password_hash = 'hashedpassword';
      user.comparePassword = jest.fn().mockResolvedValue(true);

      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(user.comparePassword).toHaveBeenCalledWith('password123');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(undefined);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = new User();
      user.email = 'test@example.com';
      user.password_hash = 'hashedpassword';
      user.comparePassword = jest.fn().mockResolvedValue(false);

      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(user.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = new User();
      user.user_id = 1;
      user.email = 'test@example.com';

      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(user);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.user_id,
      });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });
  });
});
