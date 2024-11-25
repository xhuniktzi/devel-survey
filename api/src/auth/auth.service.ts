import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAndRegisterDto } from './dto/login-and-register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginAndRegisterDto) {
    const { username, password } = dto;
    const validateUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!validateUser) {
      throw new NotFoundException('user not found');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      validateUser.password,
    );

    if (isPasswordValid) {
      const payload: JwtDto = { username, sub: validateUser.id };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } else {
      throw new UnauthorizedException('password is incorrect');
    }
  }

  async register(dto: LoginAndRegisterDto): Promise<User> {
    const { username, password } = dto;

    const validateUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (validateUser) {
      throw new BadRequestException('user is exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data: User = {
      username,
      password: hashedPassword,
      id: undefined,
    };
    const createdUser = await this.prisma.user.create({
      data,
    });
    delete createdUser.password;

    return createdUser;
  }
}
