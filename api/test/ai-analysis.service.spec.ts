import { Test, TestingModule } from '@nestjs/testing';
import { AiAnalysisService } from '../src/modules/ai-analysis/ai-analysis.service';
import { PrismaService } from '../src/database/prisma.service';
import {
  AI_CLIENT,
  type AiClient,
} from '../src/modules/ai-analysis/ai-client.interface';
import { ProjectNotFoundException } from '../src/common/business-exceptions';
import { MockAiClient } from '../src/modules/ai-analysis/mock-ai-client';

describe('AiAnalysisService', () => {
  let service: AiAnalysisService;
  let prisma: PrismaService;
  let aiClient: AiClient;

  const mockProject = {
    id: 'test-id',
    name: 'Test Project',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    totalBudget: 100000,
    description: 'Test description',
    status: 'IN_REVIEW',
    risk: 'LOW',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const mockAnalysis = {
    summary: 'Test summary',
    attentionPoints: ['Point 1', 'Point 2'],
    executiveRecommendation: 'Test recommendation',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAnalysisService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findUnique: jest.fn().mockResolvedValue(mockProject),
            },
          },
        },
        {
          provide: AI_CLIENT,
          useValue: {
            generateAnalysis: jest.fn().mockResolvedValue(mockAnalysis),
          },
        },
      ],
    }).compile();

    service = module.get<AiAnalysisService>(AiAnalysisService);
    prisma = module.get<PrismaService>(PrismaService);
    aiClient = module.get<AiClient>(AI_CLIENT);
  });

  it('should analyze a project successfully with mock provider', async () => {
    const result = await service.analyze('test-id');

    expect(result.summary).toBe('Test summary');
    expect(result.attentionPoints).toEqual(['Point 1', 'Point 2']);
    expect(result.executiveRecommendation).toBe('Test recommendation');
  });

  it('should build a prompt and delegate to the configured client', async () => {
    await service.analyze('test-id');

    expect(aiClient.generateAnalysis).toHaveBeenCalledWith(
      expect.stringContaining('Test Project'),
      expect.objectContaining({ name: 'Test Project' }),
    );
  });

  it('should throw ProjectNotFoundException when project does not exist', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(null);

    await expect(service.analyze('nonexistent-id')).rejects.toThrow(
      ProjectNotFoundException,
    );
  });

  it('should pass correct project context to mock client', async () => {
    await service.analyze('test-id');

    const contextArg = (aiClient.generateAnalysis as jest.Mock).mock.calls[0][1];

    expect(contextArg.name).toBe('Test Project');
    expect(contextArg.totalBudget).toBe(100000);
    expect(contextArg.status).toBe('IN_REVIEW');
    expect(contextArg.risk).toBe('LOW');
    expect(contextArg.durationInDays).toBeGreaterThan(0);
    expect(contextArg.durationRisk).toBe('LOW');
  });

  it('should keep the mock client response useful and context-aware', async () => {
    const client = new MockAiClient();
    const result = await client.generateAnalysis('prompt', {
      name: 'Projeto realista',
      description: 'Entrega uma melhoria operacional',
      status: 'IN_REVIEW',
      risk: 'MEDIUM',
      totalBudget: 150000,
      startDate: '2026-01-01',
      endDate: '2026-04-02',
      durationInDays: 91,
      durationRisk: 'MEDIUM',
    });

    expect(result.summary).toContain('Projeto realista');
    expect(result.attentionPoints.length).toBeGreaterThan(0);
    expect(result.executiveRecommendation).not.toBe('');
  });
});
