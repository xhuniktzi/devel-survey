import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const mockGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getListSurveys: jest.fn(),
            getSurveyById: jest.fn(),
            createSurvey: jest.fn(),
            updateSurvey: jest.fn(),
            deleteSurvey: jest.fn(),
            getPaginatedResponses: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should return a list of surveys', async () => {
    const mockSurveys = [
      {
        surveyIdentifier: 1,
        name: 'Survey 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1',
        updatedBy: 'user2',
      },
    ];

    jest.spyOn(service, 'getListSurveys').mockResolvedValue(mockSurveys);

    const result = await controller.getListSurveys();

    expect(result).toEqual(mockSurveys);
    expect(service.getListSurveys).toHaveBeenCalled();
  });

  it('should return survey details', async () => {
    const mockSurvey = {
      surveyIdentifier: 1,
      name: 'Survey 1',
      description: 'Description 1',
      fields: [],
    };

    jest.spyOn(service, 'getSurveyById').mockResolvedValue(mockSurvey);

    const result = await controller.getSurveyById(1);

    expect(result).toEqual(mockSurvey);
    expect(service.getSurveyById).toHaveBeenCalledWith(1);
  });

  it('should create a new survey', async () => {
    const dto = {
      name: 'New Survey',
      description: 'Survey Description',
      fields: [],
    };

    const req = {
      user: { sub: 1, username: 'user1' },
    };

    const mockSurvey = {
      ...dto,
      id: 1,
      surveyIdentifier: 1,
      fields: [],
    };

    (jest.spyOn(service, 'createSurvey') as jest.Mock).mockResolvedValue(
      mockSurvey,
    );

    const result = await controller.createSurvey(dto, req);

    expect(result).toEqual(mockSurvey);
    expect(service.createSurvey).toHaveBeenCalledWith(dto, req.user);
  });

  it('should update an existing survey', async () => {
    const dto = {
      name: 'Updated Survey',
      description: 'Updated Description',
      fields: [],
    };

    const req = {
      user: { sub: 1, username: 'user1' },
    };

    const mockSurvey = {
      ...dto,
      id: 1,
      surveyIdentifier: 1,
      fields: [],
    };

    (jest.spyOn(service, 'updateSurvey') as jest.Mock).mockResolvedValue(
      mockSurvey,
    );

    const result = await controller.updateSurvey(1, dto, req);

    expect(result).toEqual(mockSurvey);
    expect(service.updateSurvey).toHaveBeenCalledWith(1, dto, req.user);
  });

  it('should delete a survey', async () => {
    const mockResult = {
      id: 1,
      surveyIdentifier: 1,
      isActive: false,
    };

    (jest.spyOn(service, 'deleteSurvey') as jest.Mock).mockResolvedValue(
      mockResult,
    );

    const result = await controller.deleteSurvey(1);

    expect(result).toEqual(mockResult);
    expect(service.deleteSurvey).toHaveBeenCalledWith(1);
  });

  it('should return paginated responses', async () => {
    const mockResponses = {
      total: 1,
      page: 1,
      limit: 10,
      pages: 1,
      responses: [],
    };

    jest
      .spyOn(service, 'getPaginatedResponses')
      .mockResolvedValue(mockResponses);

    const result = await controller.getPaginatedResponses(1, 10);

    expect(result).toEqual(mockResponses);
    expect(service.getPaginatedResponses).toHaveBeenCalledWith(1, 10);
  });
});
