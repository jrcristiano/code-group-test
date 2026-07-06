import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../src/modules/health/health.controller';
import { PrismaService } from '../src/database/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('liveness check (GET /health)', () => {
    it('should return status ok', () => {
      const result = controller.check();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toEqual(expect.any(String));
      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
      );
    });

    it('should always succeed — no dependencies', () => {
      const result = controller.check();
      expect(result.status).toBe('ok');
    });
  });

  describe('readiness check (GET /health/readiness)', () => {
    const createResponse = () => ({ status: jest.fn() }) as any;

    it('should return ok when database is connected', async () => {
      const response = createResponse();
      const result = await controller.readiness(response);

      expect(result.status).toBe('ok');
      expect(result.database).toBe('connected');
      expect(response.status).not.toHaveBeenCalled();
      expect(result.timestamp).toEqual(expect.any(String));
    });

    it('should return error when database is disconnected', async () => {
      jest
        .spyOn(prisma, '$queryRaw')
        .mockRejectedValue(new Error('Connection refused'));

      const response = createResponse();
      const result = await controller.readiness(response);

      expect(result.status).toBe('error');
      expect(result.database).toBe('disconnected');
      expect(response.status).toHaveBeenCalledWith(503);
    });

    it('should not throw — always returns a controlled response', async () => {
      jest
        .spyOn(prisma, '$queryRaw')
        .mockRejectedValue(new Error('Fatal error'));

      // Should not throw
      const response = createResponse();
      const result = await controller.readiness(response);
      expect(result).toBeDefined();
      expect(result.status).toBe('error');
    });
  });
});
