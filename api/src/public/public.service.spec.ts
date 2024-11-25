import { Test, TestingModule } from '@nestjs/testing';
import { PublicService } from './public.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PublicService', () => {
  let service: PublicService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicService,
        {
          provide: PrismaService,
          useValue: {
            survey: {
              findFirst: jest.fn(),
            },
            response: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PublicService>(PublicService);
    prismaService = module.get<PrismaService>(PrismaService);
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
      where: {
        AND: [{ surveyIdentifier: 1 }, { isActive: true }],
      },
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

  it('should save a response', async () => {
    const dto = {
      surveyId: 1,
      answers: [
        {
          fieldId: 1,
          value: 'Answer 1',
        },
      ],
    };

    const mockResponse = {
      id: 1,
      surveyId: 1,
      createdAt: new Date(),
      answers: dto.answers,
    };

    (prismaService.response.create as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    const result = await service.saveResponse(dto);

    expect(result).toEqual(mockResponse);
    expect(prismaService.response.create).toHaveBeenCalledWith({
      data: {
        surveyId: dto.surveyId,
        answers: {
          create: dto.answers.map((f) => ({
            fieldId: f.fieldId,
            value: f.value,
          })),
        },
      },
      include: { answers: true },
    });
  });
});
