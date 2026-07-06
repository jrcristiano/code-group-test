import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../../common/project-status.enum';
import { ProjectRisk } from '../../../common/project-risk.enum';

export class ProjectResponseDto {
  @ApiProperty({ format: 'uuid', example: '66c587e9-55cd-4891-b509-fa00cd29e275' })
  id: string;

  @ApiProperty({ example: 'Implantação ERP' })
  name: string;

  @ApiProperty({ format: 'date', example: '2026-07-01' })
  startDate: string;

  @ApiProperty({ format: 'date', example: '2026-10-01' })
  endDate: string;

  @ApiProperty({ example: 150000 })
  totalBudget: number;

  @ApiProperty({ example: 'Implantação do sistema corporativo.' })
  description: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.IN_REVIEW })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectRisk, example: ProjectRisk.MEDIUM })
  risk: ProjectRisk;

  @ApiProperty({ format: 'date-time', example: '2026-07-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ format: 'date-time', example: '2026-07-01T12:00:00.000Z' })
  updatedAt: string;
}
