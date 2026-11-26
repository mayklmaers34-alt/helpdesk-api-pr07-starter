import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Role } from '../users/user.model.js';
import { UsersService } from '../users/users.service.js';
import { randomUUID } from 'crypto';

const PASSWORDS: Record<Role, string> = {
  student: 'student123',
  teacher: 'teacher123',
  admin: 'admin123',
};

@Injectable()
export class AuthService {
  private tokens = new Map<string, { userId: number; expiresAt: number }>();

  constructor(private usersService: UsersService) {}

  async login(email: string, pass: string) {
    if (!email.includes('@')) {
      throw new UnprocessableEntityException('Некоректний email');
    }
    const user = this.usersService.findByEmail(email);
    if (!user || PASSWORDS[user.role] !== pass) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const payload = { userId: user.id, expiresAt: Date.now() + 3600000 };
    const token = randomUUID();
    this.tokens.set(token, payload);

    return { accessToken: token, tokenType: 'Bearer', expiresIn: 3600 };
  }

  async verify(token: string) {
    const payload = this.tokens.get(token);
    if (!payload || payload.expiresAt < Date.now()) {
      throw new UnauthorizedException('Недійсний або протермінований токен');
    }
    const user = this.usersService.findOne(payload.userId);
    if (!user) throw new UnauthorizedException('Користувача не знайдено');
    return user;
  }
}