// src/users/users.service.ts

import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EditUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

    const user = this.usersRepository.create({
      email,
      password_hash: password,
      username,
    });

    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('Email or username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(user_id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByAppleId(apple_id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { apple_id } });
  }

  async findByGoogleId(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async editProfile(user_id: number, updatedData: EditUserDto): Promise<User> {
    const user = await this.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.assign(user, {
      ...updatedData,
      updated_at: new Date().toISOString(),
    });
    try {
      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
