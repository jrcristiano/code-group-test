import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { IsDateOnly } from '../../../common/is-date-only.validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Implantação ERP v2' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateOnly()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-01' })
  @IsOptional()
  @IsDateOnly()
  endDate?: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'O orçamento deve ser maior que zero.' })
  totalBudget?: number;

  @ApiPropertyOptional({ example: 'Descrição atualizada.' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  @MaxLength(5000)
  description?: string;
}
