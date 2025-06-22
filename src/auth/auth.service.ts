// src/auth/auth.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginAppleDto, LoginGoogleDto } from './dto/auth.dto';
import appleSignin from 'apple-signin-auth';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  // Login and generate JWT
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async appleAuth(
    loginAppleDto: LoginAppleDto,
  ): Promise<{ access_token: string }> {
    const { apple_token, deviceToken } = loginAppleDto;

    try {
      const appleResp = await appleSignin.verifyIdToken(apple_token, {
        audience: 'com.test-test.ios',
      });

      const { email } = appleResp;
      const user = await this.usersService.findByAppleId(email);

      //creating user and returning jwt
      if (!user) {
        const newUser = await this.usersRepository.create({
          apple_id: email,
          username: email,
          email: email,
          password_hash: '',
          deviceToken,
        });

        const newUserSaved = await this.usersRepository.save(newUser);
        if (!newUserSaved) throw new Error('Error creating user');

        const payload = {
          email: newUserSaved.email,
          sub: newUserSaved.user_id,
        };

        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      //flow where user already exists and returning jwt
      if (user) {
        //update expo token
        if (deviceToken) {
          await this.usersRepository.update(user.user_id, {
            deviceToken,
          });
        }

        const payload = { email: user.email, sub: user.user_id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async googleAuth(loginGoogleDto: LoginGoogleDto) {
    const { google_token_id, deviceToken } = loginGoogleDto;

    try {
      const ticket = await client.verifyIdToken({
        idToken: google_token_id, //it's 'id_token' in google body answer
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      const user = await this.usersService.findByGoogleId(email);

      if (!user) {
        const newUser = await this.usersRepository.create({
          username: name ?? email,
          email: email,
          password_hash: '',
          avatar_url: picture,
          deviceToken,
        });

        const newUserSaved = await this.usersRepository.save(newUser);
        if (!newUserSaved) throw new Error('Error creating user');

        const payload = {
          email: newUserSaved.email,
          sub: newUserSaved.user_id,
        };

        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      if (user) {
        //update expo token
        if (deviceToken) {
          await this.usersRepository.update(user.user_id, {
            deviceToken,
          });
        }

        const payload = { email: user.email, sub: user.user_id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      return payload;
    } catch (error) {
      throw new InternalServerErrorException({
        name: error.name,
        message: error.message,
      });
    }
  }
}
