import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QuizAttempt } from './quiz-attempt.entity';
import { Quiz } from './quiz.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => QuizAttempt, attempt => attempt.user)
  attempts: QuizAttempt[];

  @OneToMany(() => Quiz, quiz => quiz.userCreator)
  createdQuizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}