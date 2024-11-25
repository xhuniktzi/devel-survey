import { Injectable, NotFoundException } from '@nestjs/common';
import { Survey } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAndUpdateSurveyDto } from './dto/create-and-update-survey.dto';
import { JwtDto } from '../auth/dto/jwt.dto';
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getListSurveys(): Promise<any[]> {
    const surveys = await this.prisma.survey.findMany({
      where: { isActive: true },
      orderBy: [{ surveyIdentifier: 'asc' }, { version: 'desc' }],
      distinct: ['surveyIdentifier'],
      include: {
        user: true,
      },
    });

    return await Promise.all(
      surveys.map(async (survey) => {
        const creationDetails = await this.prisma.survey.findFirst({
          where: { surveyIdentifier: survey.surveyIdentifier },
          orderBy: { version: 'asc' },
          include: { user: true },
        });

        return {
          surveyIdentifier: survey.surveyIdentifier,
          name: survey.name,
          description: survey.description,
          createdAt: creationDetails.timestamp,
          updatedAt: survey.timestamp,
          createdBy: creationDetails.user.username,
          updatedBy: survey.user.username,
        };
      }),
    );
  }

  async getSurveyById(surveyIdentifier: number): Promise<any> {
    const survey = await this.prisma.survey.findFirst({
      where: { surveyIdentifier, isActive: true },
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

    return survey;
  }

  async createSurvey(
    dto: CreateAndUpdateSurveyDto,
    user: JwtDto,
  ): Promise<Survey> {
    const { name, description, fields } = dto;

    return await this.prisma.survey.create({
      data: {
        name,
        description,
        userId: user.sub,
        surveyIdentifier: await this.getNextSurveyId(),
        fields: {
          create: fields.map((field) => ({
            name: field.name,
            typeId: field.typeId,
            isRequired: field.isRequired,
            options: {
              create: field.options?.map((value) => ({ value })) || [],
            },
          })),
        },
      },
      include: {
        fields: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async updateSurvey(
    surveyIdentifier: number,
    dto: CreateAndUpdateSurveyDto,
    user: JwtDto,
  ) {
    const { name, description, fields } = dto;

    const currentSurvey = await this.prisma.survey.findFirst({
      where: {
        AND: [{ surveyIdentifier }, { isActive: true }],
      },
      orderBy: { version: 'desc' },
      distinct: ['surveyIdentifier'],
    });

    if (!currentSurvey) {
      throw new NotFoundException('Survey not found');
    }

    const newVersion = currentSurvey.version + 1;

    const updatedSurvey = await this.prisma.$transaction(async (prisma) => {
      const newSurvey = await prisma.survey.create({
        data: {
          name,
          description,
          version: newVersion,
          isActive: true,
          userId: user.sub,
          surveyIdentifier: currentSurvey.surveyIdentifier,
          fields: {
            create: fields.map((field) => ({
              name: field.name,
              typeId: field.typeId,
              isRequired: field.isRequired,
              options:
                (field.typeId === 4 || field.typeId === 5) && field.options
                  ? {
                      create: field.options.map((option) => ({
                        value: option,
                      })),
                    }
                  : undefined,
            })),
          },
        },
        include: {
          fields: {
            include: {
              options: true,
            },
          },
        },
      });

      await prisma.survey.update({
        where: { id: currentSurvey.id },
        data: { isActive: false },
      });

      return newSurvey;
    });

    return updatedSurvey;
  }

  async deleteSurvey(surveyIdentifier: number) {
    const findSurvey = await this.prisma.survey.findFirst({
      where: {
        AND: [{ surveyIdentifier }, { isActive: true }],
      },
      orderBy: { version: 'desc' },
      distinct: ['surveyIdentifier'],
    });

    if (!findSurvey) {
      throw new NotFoundException('Survey not found');
    }

    return await this.prisma.survey.update({
      where: { id: findSurvey.id },
      data: { isActive: false },
    });
  }

  async getPaginatedResponses(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const [responses, total] = await Promise.all([
      this.prisma.response.findMany({
        skip: offset,
        take: limit,
        include: {
          survey: true,
          answers: {
            include: {
              field: true,
            },
          },
        },
      }),
      this.prisma.response.count(),
    ]);

    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      responses,
    };
  }

  private async getNextSurveyId(): Promise<number> {
    const lastSurvey = await this.prisma.survey.findFirst({
      orderBy: { surveyIdentifier: 'desc' },
    });
    return lastSurvey ? lastSurvey.surveyIdentifier + 1 : 1;
  }
}
