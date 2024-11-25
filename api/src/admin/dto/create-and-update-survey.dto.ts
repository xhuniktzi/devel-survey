import { ApiProperty } from '@nestjs/swagger';
import { CreateAndUpdateFieldDto } from './create-and-update-field.dto';

export class CreateAndUpdateSurveyDto {
  @ApiProperty({
    description: 'Name of the survey',
    example: 'Customer Feedback Survey',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the survey',
    example: 'This survey collects customer feedback.',
  })
  description: string;

  @ApiProperty({
    description: 'Fields of the survey',
    type: [CreateAndUpdateFieldDto],
  })
  fields: CreateAndUpdateFieldDto[];
}
