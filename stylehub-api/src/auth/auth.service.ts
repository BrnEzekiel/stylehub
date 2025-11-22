// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { AdminCreateUserDto } from '../users/dto/admin-create-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }) {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }
    const existingPhone = await this.usersService.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictException('Phone number already in use');
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    try {
      const user = await this.usersService.create({
        name: dto.name,
        username: dto.username,
        email: dto.email,
        phone: dto.phone,
        password_hash: hashedPassword,
        role: dto.role,
      });
      const payload = { sub: user.id, email: user.email, role: user.role, username: user.username };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1d',
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }),
      ]);
      const { password_hash, ...userResult } = user;
      return {
        user: userResult,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Email or phone already exists');
      }
      console.error('Error during user registration:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    this.logger.log(`Validating user: ${email}. User object received: ${JSON.stringify(user)}`);
    if (user && user.password_hash && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    this.logger.warn(`Validation failed for: ${email}. 'user.password_hash' was falsy or compare failed.`);
    return null;
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.id || !user.email || !user.role) {
      console.error('User object missing expected properties after validation:', user);
      throw new InternalServerErrorException('User data incomplete after validation.');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid refresh token payload content');
      }
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User associated with refresh token not found');
      }
      if (!user.id || !user.email || !user.role) {
        console.error('User object missing expected properties during refresh:', user);
        throw new InternalServerErrorException('User data incomplete during refresh.');
      }
      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      });
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      console.error("Refresh token error:", e.message);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfileByEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password_hash, ...profile } = user;
    return profile;
  }

  /**
   * 3. 🛑 NEW: Admin creates a user
   */
  async adminCreateUser(dto: AdminCreateUserDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }
    const existingPhone = await this.usersService.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictException('Phone number already in use');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    try {
      const user = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        username: dto.email.split('@')[0],
        phone: dto.phone,
        password_hash: hashedPassword,
        role: dto.role as Role,
      });

      const { password_hash, ...userResult } = user;
      return userResult;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Email or phone already exists');
      }
      console.error('Error during admin user creation:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }
}
