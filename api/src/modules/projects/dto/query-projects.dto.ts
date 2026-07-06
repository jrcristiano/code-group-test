import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ProjectRisk } from '../../../common/project-risk.enum';
import { ProjectStatus } from '../../../common/project-status.enum';

export class QueryProjectsDto {
  @ApiPropertyOptional({ example: 1, description: 'Número da página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Itens por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Campo para ordenação',
    enum: ['name', 'startDate', 'endDate', 'totalBudget', 'status', 'risk', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'startDate', 'endDate', 'totalBudget', 'status', 'risk', 'createdAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    example: 'ERP',
    description: 'Trecho do nome do projeto (busca sem diferenciar maiúsculas)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  search?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectRisk })
  @IsOptional()
  @IsEnum(ProjectRisk)
  risk?: ProjectRisk;
}
