import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceDomain } from 'src/domain/resource/resource.domain';
import { Resource } from 'src/models/resource.model';
import { CreateResourceDto } from 'src/modules/resource/dto/create-resource.dto';
import { UpdateResourceDto } from 'src/modules/resource/dto/update-resource.dto';

@Injectable()
export class ResourceApplication {
  constructor(private readonly resourceDomain: ResourceDomain) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource: Resource = new Resource();

    Object.assign(newResource, createResourceDto);

    const createdResource: Resource =
      await this.resourceDomain.createNewResource(newResource);

    return createdResource;
  }

  async findAll(): Promise<Array<Resource>> {
    const resources: Array<Resource> = await this.resourceDomain.findAll();
    return resources;
  }

  async findOne(id: string): Promise<Resource> {
    const resource: Resource = await this.resourceDomain.findByStringId(id);
    if (!resource) {
      throw new NotFoundException('RESOURCE_NOT_FOUND');
    }
    return resource;
  }

  async update(
    id: string,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    Object.assign(resource, updateResourceDto);
    this.resourceDomain.update(resource.id, resource);
    return resource;
  }

  async remove(id: string) {
    const resource: Resource = await this.findOne(id);
    this.resourceDomain.remove(resource.id);
  }
}
