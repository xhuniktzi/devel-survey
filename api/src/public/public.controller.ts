import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { SaveResponseDto } from './dto/save-response.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get survey details by its identifier' })
  @ApiParam({ name: 'id', description: 'Survey identifier', type: Number })
  @ApiResponse({ status: 200, description: 'Survey details including fields' })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async getSurveyById(@Param('id', ParseIntPipe) id: number) {
    return await this.publicService.getSurveyById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit responses to a survey' })
  @ApiResponse({ status: 201, description: 'Responses saved successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error in submitted responses',
  })
  async saveResponse(@Body() dto: SaveResponseDto) {
    return await this.publicService.saveResponse(dto);
  }
}
