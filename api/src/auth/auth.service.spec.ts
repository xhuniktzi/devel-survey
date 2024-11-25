import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const dto = { username: 'user1', password: 'password123' };
      const user = {
        id: 1,
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('access_token');

      const result = await service.login(dto);

      expect(result).toEqual({ access_token: 'access_token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'user1',
        sub: 1,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const dto = { username: 'nonexistent', password: 'password123' };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const dto = { username: 'user1', password: 'wrongpassword' };
      const user = {
        id: 1,
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { username: 'newuser', password: 'password123' };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'newuser',
        password: 'hashedpassword',
      });

      const result = await service.register(dto);

      expect(result).toEqual({
        id: 1,
        username: 'newuser',
        password: undefined,
      });

      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      const dto = { username: 'existinguser', password: 'password123' };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
