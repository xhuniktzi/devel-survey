import { ApiProperty } from '@nestjs/swagger';

export class CreateAndUpdateFieldDto {
  @ApiProperty({ description: 'Name of the field', example: 'Age' })
  name: string;

  @ApiProperty({ description: 'Type of the field', example: 1 })
  typeId: number;

  @ApiProperty({ description: 'Is the field required?', example: true })
  isRequired: boolean;

  @ApiProperty({
    description: 'Options for multiple or single choice fields',
    example: ['Option 1', 'Option 2'],
    required: false,
  })
  options?: string[];
}
