import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // <-- ADICIONE OneToMany AQUI
import { QuizAttempt } from './quiz-attempt.entity';

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

  @OneToMany(() => QuizAttempt, attempt => attempt.user)
  attempts: QuizAttempt[];
}