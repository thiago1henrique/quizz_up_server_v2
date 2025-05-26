// src/entities/quiz-attempt.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  totalQuestions: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, user => user.attempts)
  user: User;

  @ManyToOne(() => Quiz, quiz => quiz.attempts)
  quiz: Quiz;
}