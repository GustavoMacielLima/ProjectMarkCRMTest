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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExempleService } from './exemple.service';
import { CreateExempleDto } from './dto/create-exemple.dto';
import { UpdateExempleDto } from './dto/update-exemple.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthGuard, RequestUser } from '../auth/auth.guard';
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
    // Cache exemple only json return
    /* const produtoCache = await this.cacheManager.get<ProdutoEntity>(
      `produto-${id}`,
    );

    if (!produtoCache) {
      const produto = await this.produtoService.listaProdutoPorId(id);

      await this.cacheManager.set(`produto-${id}`, produto);
      return { message: 'Produto Listado', data: produto };
    }

    return { message: 'Produto Listado', data: produtoCache }; */
    return this.exempleService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor) // Cache exemple with full message
  findOne(@Param('id') id: string) {
    return this.exempleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExempleDto: UpdateExempleDto,
    @Req() req: RequestUser, //Exemple to use logged user
  ) {
    console.log(req.user.sub);
    return this.exempleService.update(+id, updateExempleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exempleService.remove(+id);
  }
}
