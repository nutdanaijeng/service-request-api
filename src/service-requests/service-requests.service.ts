import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ListServiceRequestsDto } from './dto/list-service-requests.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateServiceRequestDto) {
    return this.prisma.serviceRequest.create({ data: dto });
  }

  // Filter order matches the composite index (office_code, status, created_at DESC)
  findAll({ officeCode, status, limit }: ListServiceRequestsDto) {
    return this.prisma.serviceRequest.findMany({
      where: { officeCode, status, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findOne(id: number) {
    const request = await this.prisma.serviceRequest.findFirst({
      where: { id, deletedAt: null },
    });
    if (!request) {
      throw new NotFoundException(`Service request ${id} not found`);
    }
    return request;
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    await this.findOne(id);
    return this.prisma.serviceRequest.update({ where: { id }, data: { status: dto.status } });
  }

  // Soft delete: keep the row for auditing
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.serviceRequest.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
