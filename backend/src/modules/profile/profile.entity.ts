import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  aboutMe: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column({ type: 'boolean', default: true })
  showProjects: boolean;

  @Column({ type: 'boolean', default: true })
  showExperiences: boolean;

  @Column({ type: 'boolean', default: true })
  showAcademics: boolean;

  @Column({ type: 'boolean', default: true })
  showBlog: boolean;

  @Column({ type: 'boolean', default: true })
  showAwards: boolean;

  @Column({ type: 'boolean', default: true })
  showOrganizations: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
