import { RequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
