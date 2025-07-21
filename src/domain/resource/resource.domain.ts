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
import { Resource } from 'src/models/resource.model';
import { User, UserRole } from 'src/models/user.model';

@Injectable()
export class ResourceDomain extends BaseDomain<Resource> {
  constructor(
    @Inject(RepositoryProvider.RESOURCE)
    resourceRepository: Repository<Resource>,
    public readonly sessionService: SessionService,
  ) {
    super(resourceRepository, sessionService);
  }

  public async createNewResource(resource: Resource): Promise<Resource> {
    const loggedUser: User = this.sessionService.getUser();
    if (loggedUser && loggedUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    const existingResource = await this.findOne(
      {
        url: resource.url,
      },
      true,
    );
    if (existingResource) {
      throw new BadRequestException('RESOURCE_ALREADY_EXISTS');
    }
    const newResource = await this.create(resource);
    return newResource;
  }

  protected getEntityName(): string {
    return 'RESOURCE';
  }
}
