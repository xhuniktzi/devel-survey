import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JwtDto } from '../auth/dto/jwt.dto';
import { CreateAndUpdateSurveyDto } from './dto/create-and-update-survey.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('surveys')
  @ApiOperation({
    summary: 'Retrieve a list of active surveys with minimal details',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active surveys with minimal details',
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  async getListSurveys() {
    return this.adminService.getListSurveys();
  }

  @Get('surveys/:id')
  @ApiOperation({ summary: 'Retrieve survey details by its identifier' })
  @ApiParam({ name: 'id', description: 'Survey identifier', type: Number })
  @ApiResponse({ status: 200, description: 'Survey details including fields' })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  @UseGuards(JwtAuthGuard)
  async getSurveyById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getSurveyById(id);
  }

  @Post('surveys')
  @ApiOperation({ summary: 'Create a new survey' })
  @ApiResponse({ status: 201, description: 'Survey created successfully' })
  @UseGuards(JwtAuthGuard)
  async createSurvey(
    @Body() dto: CreateAndUpdateSurveyDto,
    @Request() req: any,
  ) {
    const user: JwtDto = req.user;
    return this.adminService.createSurvey(dto, user);
  }

  @Put('surveys/:id')
  @ApiOperation({ summary: 'Update an existing survey' })
  @ApiParam({ name: 'id', description: 'Survey identifier', type: Number })
  @ApiResponse({ status: 200, description: 'Survey updated successfully' })
  @UseGuards(JwtAuthGuard)
  async updateSurvey(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAndUpdateSurveyDto,
    @Request() req: any,
  ) {
    const user: JwtDto = req.user;
    return this.adminService.updateSurvey(id, dto, user);
  }

  @Delete('surveys/:id')
  @ApiOperation({ summary: 'Delete a survey by marking it inactive' })
  @ApiParam({ name: 'id', description: 'Survey identifier', type: Number })
  @ApiResponse({ status: 200, description: 'Survey deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deleteSurvey(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSurvey(id);
  }

  @Get('responses')
  @ApiOperation({ summary: 'Retrieve paginated responses for all surveys' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default is 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default is 10)',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of responses' })
  @UseGuards(JwtAuthGuard)
  async getPaginatedResponses(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.adminService.getPaginatedResponses(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }
}
