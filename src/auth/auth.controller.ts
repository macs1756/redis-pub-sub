// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  TokenDto,
  LoginAppleDto,
  LoginGoogleDto,
  InvalidTokenDto,
} from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login Endpoint
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and obtain JWT token' })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: TokenDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: TokenDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Authorization failed token is invalid',
    type: InvalidTokenDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('apple')
  @ApiOperation({ summary: 'Authentication user via appleId' })
  async appleSignIn(@Body() loginAppleDto: LoginAppleDto) {
    return this.authService.appleAuth(loginAppleDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: TokenDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('google')
  @ApiOperation({ summary: 'Authenticate user via google' })
  async googleSignIn(@Body() loginGoogleDto: LoginGoogleDto) {
    return this.authService.googleAuth(loginGoogleDto);
  }
}
