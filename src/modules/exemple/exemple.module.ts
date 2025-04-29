import { Module } from '@nestjs/common';
import { ExempleService } from './exemple.service';
import { ExempleController } from './exemple.controller';

@Module({
  controllers: [ExempleController],
  providers: [ExempleService],
})
export class ExempleModule {}
