import { ApiProperty } from '@nestjs/swagger';

export class AnswerResponseDto {
  @ApiProperty({ description: 'ID of the field being answered', example: 1 })
  fieldId: number;

  @ApiProperty({ description: 'Value of the response', example: 'John Doe' })
  value: string;
}
