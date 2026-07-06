import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ProjectsService } from './projects.service';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { PaginatedProjectsResponseDto } from './dto/paginated-projects-response.dto';
import { ProjectAnalysisResponseDto } from '../ai-analysis/dto/project-analysis-response.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Criar projeto' })
  @ApiResponse({
    status: 201,
    description: 'Projeto criado com sucesso.',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() dto: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos com paginação e ordenação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'ERP' })
  @ApiQuery({ name: 'status', required: false, type: String, example: 'IN_REVIEW' })
  @ApiQuery({ name: 'risk', required: false, type: String, example: 'HIGH' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de projetos.',
    type: PaginatedProjectsResponseDto,
  })
  findAll(
    @Query() query: QueryProjectsDto,
  ): Promise<PaginatedProjectsResponseDto> {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({
    status: 200,
    description: 'Projeto encontrado.',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Atualizar projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({
    status: 200,
    description: 'Projeto atualizado.',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Remover projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({ status: 204, description: 'Projeto removido.' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({
    status: 422,
    description: 'Projeto não pode ser excluído.',
  })
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.projectsService.remove(id);
  }

  @Patch(':id/status')
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({ summary: 'Alterar status do projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado.',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({
    status: 422,
    description: 'Transição de status inválida.',
  })
  updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateProjectStatusDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.updateStatus(id, dto);
  }

  @Get(':id/ai-analysis')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Gerar análise com IA do projeto' })
  @ApiParam({ name: 'id', description: 'ID do projeto' })
  @ApiResponse({
    status: 200,
    description: 'Análise gerada com sucesso.',
    type: ProjectAnalysisResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  getAiAnalysis(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ProjectAnalysisResponseDto> {
    return this.aiAnalysisService.analyze(id);
  }
}
