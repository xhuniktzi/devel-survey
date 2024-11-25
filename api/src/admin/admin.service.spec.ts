import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { JwtDto } from '../auth/dto/jwt.dto';

describe('AdminService', () => {
  let service: AdminService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: {
            survey: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            response: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return a list of active surveys with minimal details', async () => {
    const mockSurveys = [
      {
        surveyIdentifier: 1,
        name: 'Survey 1',
        description: 'Description 1',
        timestamp: new Date('2023-01-01'),
        user: { username: 'user1' },
      },
    ];

    (prismaService.survey.findMany as jest.Mock).mockResolvedValue(mockSurveys);
    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue({
      timestamp: new Date('2023-01-01'),
      user: { username: 'creator1' },
    });

    const result = await service.getListSurveys();

    expect(result).toEqual([
      {
        surveyIdentifier: 1,
        name: 'Survey 1',
        description: 'Description 1',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        createdBy: 'creator1',
        updatedBy: 'user1',
      },
    ]);

    expect(prismaService.survey.findMany).toHaveBeenCalled();
    expect(prismaService.survey.findFirst).toHaveBeenCalled();
  });

  it('should return survey details by its identifier', async () => {
    const mockSurvey = {
      surveyIdentifier: 1,
      isActive: true,
      version: 1,
      name: 'Survey 1',
      description: 'Description 1',
      fields: [
        {
          id: 1,
          name: 'Field 1',
          typeId: 1,
          isRequired: true,
          options: [],
        },
      ],
    };

    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(mockSurvey);

    const result = await service.getSurveyById(1);

    expect(result).toEqual(mockSurvey);
    expect(prismaService.survey.findFirst).toHaveBeenCalledWith({
      where: { surveyIdentifier: 1, isActive: true },
      orderBy: { version: 'desc' },
      distinct: ['surveyIdentifier'],
      include: {
        fields: {
          include: {
            options: true,
          },
        },
      },
    });
  });

  it('should throw NotFoundException if survey is not found', async () => {
    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.getSurveyById(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a new survey', async () => {
    const dto = {
      name: 'New Survey',
      description: 'Survey Description',
      fields: [
        {
          name: 'Field 1',
          typeId: 1,
          isRequired: true,
          options: [],
        },
      ],
    };

    const user: JwtDto = { sub: 1, username: 'user1' };

    (prismaService.survey.create as jest.Mock).mockResolvedValue({
      ...dto,
      id: 1,
      surveyIdentifier: 1,
      userId: user.sub,
      fields: [],
    });

    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(null);

    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await service.createSurvey(dto, user);

    expect(result).toHaveProperty('name', 'New Survey');
    expect(prismaService.survey.create).toHaveBeenCalled();
  });

  it('should update an existing survey', async () => {
    const surveyIdentifier = 1;
    const dto = {
      name: 'Updated Survey',
      description: 'Updated Description',
      fields: [
        {
          name: 'Field 1',
          typeId: 1,
          isRequired: true,
          options: [],
        },
      ],
    };
    const user: JwtDto = { sub: 1, username: 'user1' };

    const currentSurvey = {
      id: 1,
      surveyIdentifier,
      version: 1,
      isActive: true,
    };

    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(
      currentSurvey,
    );

    (prismaService.$transaction as jest.Mock).mockImplementation(
      async (callback) => {
        return await callback(prismaService);
      },
    );

    (prismaService.survey.create as jest.Mock).mockResolvedValue({
      ...currentSurvey,
      ...dto,
      version: 2,
      isActive: true,
    });

    (prismaService.survey.update as jest.Mock).mockResolvedValue({
      ...currentSurvey,
      isActive: false,
    });

    const result = await service.updateSurvey(surveyIdentifier, dto, user);

    expect(result).toHaveProperty('name', 'Updated Survey');
    expect(prismaService.survey.findFirst).toHaveBeenCalled();
    expect(prismaService.$transaction).toHaveBeenCalled();
  });

  it('should throw NotFoundException if survey to update is not found', async () => {
    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updateSurvey(999, {} as any, { sub: 1, username: 'user1' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a survey by marking it inactive', async () => {
    const findSurvey = {
      id: 1,
      surveyIdentifier: 1,
      isActive: true,
    };

    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(findSurvey);
    (prismaService.survey.update as jest.Mock).mockResolvedValue({
      ...findSurvey,
      isActive: false,
    });

    const result = await service.deleteSurvey(1);

    expect(result.isActive).toBe(false);
    expect(prismaService.survey.update).toHaveBeenCalledWith({
      where: { id: findSurvey.id },
      data: { isActive: false },
    });
  });

  it('should throw NotFoundException when deleting a non-existent survey', async () => {
    (prismaService.survey.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.deleteSurvey(999)).rejects.toThrow(NotFoundException);
  });

  it('should return paginated responses', async () => {
    const mockResponses = [
      {
        id: 1,
        surveyId: 1,
        createdAt: new Date(),
        answers: [],
        survey: { name: 'Survey 1' },
      },
    ];

    (prismaService.response.findMany as jest.Mock).mockResolvedValue(
      mockResponses,
    );
    (prismaService.response.count as jest.Mock).mockResolvedValue(1);

    const result = await service.getPaginatedResponses(1, 10);

    expect(result).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      pages: 1,
      responses: mockResponses,
    });

    expect(prismaService.response.findMany).toHaveBeenCalled();
    expect(prismaService.response.count).toHaveBeenCalled();
  });
});
