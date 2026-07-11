import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './award.entity';

@Injectable()
export class AwardService {
  constructor(
    @InjectRepository(Award)
    private readonly repo: Repository<Award>,
  ) {}

  findAll() {
    return this.repo.find({ order: { year: 'DESC', order: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Award>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Award>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
