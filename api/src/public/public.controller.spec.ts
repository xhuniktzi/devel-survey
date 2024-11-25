import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { SaveResponseDto } from './dto/save-response.dto';

describe('PublicController', () => {
  let controller: PublicController;
  let service: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: PublicService,
          useValue: {
            getSurveyById: jest.fn(),
            saveResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
    service = module.get<PublicService>(PublicService);
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

  it('should save a survey response', async () => {
    const dto: SaveResponseDto = {
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

    jest.spyOn(service, 'saveResponse').mockResolvedValue(mockResponse);

    const result = await controller.saveResponse(dto);

    expect(result).toEqual(mockResponse);
    expect(service.saveResponse).toHaveBeenCalledWith(dto);
  });
});
