import { ApiProperty } from '@nestjs/swagger';
import { AnswerResponseDto } from './answer-response.dto';

export class SaveResponseDto {
  @ApiProperty({
    description: 'ID of the survey being responded to',
    example: 1,
  })
  surveyId: number;

  @ApiProperty({
    description: 'List of responses to survey fields',
    type: [AnswerResponseDto],
  })
  answers: AnswerResponseDto[];
}
