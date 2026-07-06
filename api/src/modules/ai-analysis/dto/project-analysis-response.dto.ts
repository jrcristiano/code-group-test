import { ApiProperty } from '@nestjs/swagger';

export class ProjectAnalysisResponseDto {
  @ApiProperty({
    example: 'Resumo executivo do projeto de implantação ERP...',
  })
  summary: string;

  @ApiProperty({
    example: [
      'Orçamento elevado requer controle financeiro rigoroso.',
      'Prazo estendido demanda marcos intermediários.',
    ],
  })
  attentionPoints: string[];

  @ApiProperty({
    example: 'Recomenda-se iniciar com um piloto em uma unidade...',
  })
  executiveRecommendation: string;
}
