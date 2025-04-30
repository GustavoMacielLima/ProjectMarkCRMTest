import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { RepositoryProvider } from 'src/repository/repository.provider';
import { BaseDomain } from '../base.domain';
import { SessionService } from 'src/resources/services/session.service';
import { Pdv } from 'src/models/pdv.model';
import { User, UserRole } from 'src/models/user.model';

@Injectable()
export class PdvDomain extends BaseDomain<Pdv> {
  constructor(
    @Inject(RepositoryProvider.USER)
    pdvRepository: Repository<Pdv>,
    public readonly sessionService: SessionService,
  ) {
    super(pdvRepository, sessionService);
  }

  public async createNewPdv(pdv: Pdv): Promise<Pdv> {
    const loggedUser: User = this.sessionService.getUser();
    if (loggedUser && loggedUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    const existingPdv = await this.findOne({
      serialNumber: pdv.serialNumber,
    });
    if (existingPdv) {
      throw new BadRequestException('SERIAL_NUMBER_ALREADY_EXISTS');
    }
    const newPdv = await this.create(pdv);
    return newPdv;
  }

  protected getEntityName(): string {
    return 'PDV';
  }
}
