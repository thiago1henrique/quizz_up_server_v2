import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne, 
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizAttempt } from './quiz-attempt.entity';
import { User } from './user.entity'; 

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @Column('simple-json') 
  questions: {
    title: string;
    alternatives: { text: string; isCorrect: boolean }[];
  }[];


  @ManyToOne(() => User, user => user.createdQuizzes, { onDelete: 'SET NULL', nullable: true }) 
  userCreator: User;

  @OneToMany(() => QuizAttempt, attempt => attempt.quiz)
  attempts: QuizAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}