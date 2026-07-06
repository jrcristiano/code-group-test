import { Controller, Get, HttpStatus, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness check — a aplicação está rodando?' })
  @ApiResponse({ status: 200, description: 'Aplicação saudável.' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Readiness check — a aplicação consegue atender requisições?',
  })
  @ApiResponse({ status: 200, description: 'Aplicação pronta.' })
  @ApiResponse({
    status: 503,
    description: 'Aplicação não está pronta (banco indisponível).',
  })
  async readiness(@Res({ passthrough: true }) response: Response) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
