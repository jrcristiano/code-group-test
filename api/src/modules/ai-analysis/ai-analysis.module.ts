import { Module } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { MockAiClient } from './mock-ai-client';
import { AI_CLIENT } from './ai-client.interface';

@Module({
  providers: [
    MockAiClient,
    { provide: AI_CLIENT, useExisting: MockAiClient },
    AiAnalysisService,
  ],
  exports: [AiAnalysisService],
})
export class AiAnalysisModule {}
