// src/users/dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;
}

export class EditUserDto {
  @ApiProperty({
    example: 'de',
    description: 'User preferred language',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    example: 'UTC',
    description: 'User timezone',
    required: false,
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    example: 'ExponentPushToken[rM8ofDDlkHi-HR2k0qMK-t]',
    description: 'Device token for push notifications',
    required: false,
  })
  @IsString()
  @IsOptional()
  deviceToken?: string;

  @ApiProperty({
    example: false,
    description: 'User preference for push notifications',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPushNotificationsEnabled?: boolean;

  @ApiProperty({
    example: 'Hello, I am John!',
    description: 'User bio',
    required: false,
  })
  bio?: string;
}
