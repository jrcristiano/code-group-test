import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from './project-response.dto';
import { ProjectSummaryResponseDto } from './project-summary-response.dto';

export class PaginatedProjectsResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  items: ProjectResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  nextPage: boolean;

  @ApiProperty({ type: ProjectSummaryResponseDto })
  summary: ProjectSummaryResponseDto;
}
