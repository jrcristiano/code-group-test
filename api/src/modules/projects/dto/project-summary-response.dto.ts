import { ApiProperty } from '@nestjs/swagger';

export class ProjectSummaryResponseDto {
  @ApiProperty({ example: 25 })
  totalProjects: number;

  @ApiProperty({ example: 8 })
  inReview: number;

  @ApiProperty({ example: 4 })
  inExecution: number;

  @ApiProperty({ example: 70000 })
  listedBudget: number;

  @ApiProperty({ example: 3 })
  highRisk: number;
}
