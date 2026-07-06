import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsDateOnly } from '../../../common/is-date-only.validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Implantação ERP' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateOnly()
  startDate: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsDateOnly()
  endDate: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0.01, { message: 'O orçamento deve ser maior que zero.' })
  totalBudget: number;

  @ApiProperty({
    example: 'Projeto para implantação de sistema ERP.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @MaxLength(5000)
  description: string;
}
