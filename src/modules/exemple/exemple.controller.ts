import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ExempleService } from './exemple.service';
import { CreateExempleDto } from './dto/create-exemple.dto';
import { UpdateExempleDto } from './dto/update-exemple.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthGuard } from '../auth/auth.guard';
//import { PasswordHash } from 'src/resources/pipes/password-hash.pipe';

@Controller('exemple')
@UseGuards(AuthGuard) //Exemple to autheticated routes, can be apply in routes too
export class ExempleController {
  constructor(
    private readonly exempleService: ExempleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  create(
    @Body() createExempleDto: CreateExempleDto,
    //@Body('senha', PasswordHash) senhaHash: string, exemple to get hashed password from pipe
  ) {
    return this.exempleService.create(createExempleDto);
  }

  @Get()
  findAll() {
    return this.exempleService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor) // Cache exemple with full message
  findOne(@Param('id') id: string) {
    return this.exempleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExempleDto: UpdateExempleDto) {
    return this.exempleService.update(+id, updateExempleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exempleService.remove(+id);
  }
}
