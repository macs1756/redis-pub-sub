// src/users/dto/user.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  user_id: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  username: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL to avatar image',
    required: false,
  })
  avatar_url?: string;

  @ApiProperty({
    example: 'Hello, I am John!',
    description: 'User bio',
    required: false,
  })
  bio?: string;

  @ApiProperty({ example: 'UTC', description: 'User timezone' })
  timezone: string;

  @ApiProperty({ example: 'en', description: 'Preferred language' })
  language: string;

  @ApiProperty({
    example: '2024-04-27T10:00:02.123Z',
    description: 'Account creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-04-27T10:00:02.123Z',
    description: 'Last account update timestamp',
  })
  updated_at: Date;

  @ApiProperty({
    example: true,
    description: 'Indicates if the account is active',
  })
  is_active: boolean;

  @ApiProperty({
    example: null,
    description: 'Timestamp of the last login',
    required: false,
  })
  last_login: Date;
}
