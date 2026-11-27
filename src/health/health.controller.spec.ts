import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const prisma = { $queryRaw: jest.fn() };
  const controller = new HealthController(prisma as unknown as PrismaService);

  it('live always returns ok', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('ready returns ok when the database responds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    await expect(controller.ready()).resolves.toEqual({ status: 'ok', database: 'up' });
  });

  it('ready returns 503 when the database is down', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));
    await expect(controller.ready()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
