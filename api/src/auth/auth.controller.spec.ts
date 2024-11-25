import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAndRegisterDto } from './dto/login-and-register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should login a user', async () => {
    const dto: LoginAndRegisterDto = {
      username: 'user1',
      password: 'password123',
    };

    const mockToken = { access_token: 'token' };

    jest.spyOn(service, 'login').mockResolvedValue(mockToken);

    const result = await controller.login(dto);

    expect(result).toEqual(mockToken);
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('should register a new user', async () => {
    const dto: LoginAndRegisterDto = {
      username: 'newuser',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      username: 'newuser',
    };

    (jest.spyOn(service, 'register') as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.register(dto);

    expect(result).toEqual(mockUser);
    expect(service.register).toHaveBeenCalledWith(dto);
  });
});
