// src/auth/dto/auth.dto.ts

import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class TokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
    description: 'JWT access token',
  })
  access_token: string;
}

export class InvalidTokenDto {
  @ApiProperty({
    description: 'The name of the error',
    example: 'TokenExpiredError',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A description of the error',
    example: 'jwt expired',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The date and time when the token expired',
    example: '2024-10-31T09:14:23.000Z',
  })
  @IsDateString()
  expiredAt: string;
}

export class LoginAppleDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
    description: 'Token who was generated on frontend via AppleId',
  })
  @IsString()
  @IsNotEmpty()
  apple_token: string;

  @ApiProperty({
    example: 'ExponentPushToken[rM8ofDDlkHi-HR2k0qMK-t]',
    description: 'Token who will be use for push notifications',
  })
  @IsString()
  @IsOptional()
  deviceToken?: string;
}

export class LoginGoogleDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
    description: 'Token id who was created on frontend for GoogleAuth',
  })
  @IsString()
  @IsNotEmpty()
  google_token_id: string;

  @ApiProperty({
    example: 'ExponentPushToken[rM8ofDDlkHi-HR2k0qMK-t]',
    description: 'Token who will be use for push notifications',
  })
  @IsString()
  @IsOptional()
  deviceToken?: string;
}
