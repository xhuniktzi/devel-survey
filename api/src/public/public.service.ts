import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaveResponseDto } from './dto/save-response.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getSurveyById(surveyIdentifier: number): Promise<any> {
    const survey = await this.prisma.survey.findFirst({
      where: {
        AND: [{ surveyIdentifier }, { isActive: true }],
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

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    survey.fields = survey.fields.map((field) => ({
      ...field,
      options:
        field.typeId === 4 || field.typeId === 5 ? field.options : undefined,
    }));

    return survey;
  }

  async saveResponse(dto: SaveResponseDto): Promise<Response> {
    const { surveyId, answers } = dto;

    return await this.prisma.response.create({
      data: {
        surveyId,
        answers: {
          create: answers.map((answer) => ({
            fieldId: answer.fieldId,
            value: answer.value || '',
          })),
        },
      },
      include: { answers: true },
    });
  }
}
