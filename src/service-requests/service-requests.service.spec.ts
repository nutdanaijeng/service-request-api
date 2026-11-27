import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceRequestsService } from './service-requests.service';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  const prisma = {
    serviceRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ServiceRequestsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ServiceRequestsService);
  });

  it('creates a request', async () => {
    const dto = { citizenId: '1234567890123', officeCode: 'BKK01' };
    prisma.serviceRequest.create.mockResolvedValue({ id: 1, ...dto, status: 'PENDING' });

    await expect(service.create(dto)).resolves.toMatchObject({ id: 1, status: 'PENDING' });
    expect(prisma.serviceRequest.create).toHaveBeenCalledWith({ data: dto });
  });

  it('lists only non-deleted requests, newest first', async () => {
    prisma.serviceRequest.findMany.mockResolvedValue([]);

    await service.findAll({ officeCode: 'BKK01', status: 'PENDING', limit: 20 });

    expect(prisma.serviceRequest.findMany).toHaveBeenCalledWith({
      where: { officeCode: 'BKK01', status: 'PENDING', deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  });

  it('throws NotFoundException when the request does not exist', async () => {
    prisma.serviceRequest.findFirst.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates status of an existing request', async () => {
    prisma.serviceRequest.findFirst.mockResolvedValue({ id: 1 });
    prisma.serviceRequest.update.mockResolvedValue({ id: 1, status: 'APPROVED' });

    await expect(service.updateStatus(1, { status: 'APPROVED' })).resolves.toMatchObject({
      status: 'APPROVED',
    });
  });

  it('soft-deletes by setting deletedAt', async () => {
    prisma.serviceRequest.findFirst.mockResolvedValue({ id: 1 });
    prisma.serviceRequest.update.mockResolvedValue({ id: 1 });

    await service.remove(1);

    expect(prisma.serviceRequest.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deletedAt: expect.any(Date) },
    });
  });
});
