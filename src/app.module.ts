import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.validation';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configValidationSchema }),
    PrismaModule,
    HealthModule,
    ServiceRequestsModule,
  ],
})
export class AppModule {}
