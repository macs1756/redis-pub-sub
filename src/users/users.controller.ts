// src/users/users.controller.ts

import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, EditUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Registration Endpoint
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: UserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto);
    const { password_hash, ...result } = user;
    return result;
  }

  // Get User Profile (Protected)
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Request() req): Promise<UserDto> {
    const user = await this.usersService.findById(req.user.user_id);
    const { password_hash, ...result } = user;
    return result;
  }

  @Post('edit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit information about user' })
  @ApiResponse({
    status: 200,
    description: 'Information about user was successefully edited.',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async editProfile(
    @Request() req,
    @Body() userData: EditUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.editProfile(
      req.user.user_id,
      userData,
    );
    const { password_hash, ...result } = user;
    return result;
  }
}
