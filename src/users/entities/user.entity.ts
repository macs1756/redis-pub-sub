import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  apple_id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: null, nullable: true })
  deviceToken: string;

  @Column({ default: true })
  isPushNotificationsEnabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  last_login: Date;

  // Hash the password before inserting into the database
  @BeforeInsert()
  async hashPassword() {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }

  // Compare password method
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}
