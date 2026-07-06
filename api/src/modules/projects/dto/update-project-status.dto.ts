import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../common/project-status.enum';

export class UpdateProjectStatusDto {
  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.APPROVED })
  @IsEnum(ProjectStatus, {
    message: 'Status inválido. Valores permitidos: IN_REVIEW, APPROVED, IN_PROGRESS, FINISHED, CANCELED.',
  })
  status: ProjectStatus;
}
