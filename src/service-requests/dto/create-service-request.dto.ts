import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateServiceRequestDto {
  @Matches(/^\d{13}$/, { message: 'citizenId must be exactly 13 digits' })
  citizenId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  officeCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
