import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {}

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Contact>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async markAsRead(id: number) {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
