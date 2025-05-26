// src/entities/quiz-attempt.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
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

  @CreateDateColumn() 
  createdAt: Date;

  @ManyToOne(() => User, user => user.attempts, { onDelete: 'SET NULL', nullable: true }) 
  user: User;

  @ManyToOne(() => Quiz, quiz => quiz.attempts, { 
    onDelete: 'CASCADE', 
    nullable: false   
  })
  quiz: Quiz;
}