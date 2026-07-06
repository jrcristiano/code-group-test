import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, type PoolConfig } from 'pg';

function buildPrismaConfig(configService: ConfigService) {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL não está definida. Verifique o arquivo .env.',
    );
  }

  if (
    !databaseUrl.startsWith('postgresql://') &&
    !databaseUrl.startsWith('postgres://')
  ) {
    throw new Error(
      'DATABASE_URL inválida. Esta aplicação suporta exclusivamente PostgreSQL.',
    );
  }

  // PostgreSQL
  const poolConfig: PoolConfig = {
    connectionString: databaseUrl,
    min: configService.get<number>('DB_POOL_MIN', 2),
    max: configService.get<number>('DB_POOL_MAX', 10),
    connectionTimeoutMillis: configService.get<number>(
      'DB_POOL_ACQUIRE_TIMEOUT',
      30000,
    ),
    idleTimeoutMillis: 30000,
  };

  const pool = new Pool(poolConfig);

  return {
    pool,
    prismaOptions: {
      adapter: new PrismaPg(pool),
      transactionOptions: { maxWait: 5000, timeout: 10000 },
    },
  };
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pgPool: Pool;

  constructor(configService: ConfigService) {
    const { pool, prismaOptions } = buildPrismaConfig(configService);
    super(prismaOptions as any);
    this.pgPool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pgPool.end();
  }
}
