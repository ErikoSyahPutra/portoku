import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organization: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  endDate: string;

  @Column({ default: false })
  current: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
