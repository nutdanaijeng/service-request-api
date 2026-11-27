import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ListServiceRequestsDto } from './dto/list-service-requests.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ServiceRequestsService } from './service-requests.service';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly service: ServiceRequestsService) {}

  @Post()
  create(@Body() dto: CreateServiceRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: ListServiceRequestsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
