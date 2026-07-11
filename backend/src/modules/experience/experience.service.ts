import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly repo: Repository<Experience>,
  ) {}

  findAll() {
    return this.repo.find({ order: { order: 'ASC', startDate: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Experience>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Experience>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
