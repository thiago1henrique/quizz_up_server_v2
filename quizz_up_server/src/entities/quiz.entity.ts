// src/entities/quiz.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // <-- Importe OneToMany
import { QuizAttempt } from './quiz-attempt.entity'; // <-- Importe QuizAttempt

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

    @Column('json')
    questions: {
        title: string;
        alternatives: {
            text: string;
            correct: boolean;
        }[];
    }[];

    @Column()
    userId: number; // Relacionamento simples sem FK para agilizar

    // --- ADICIONE ESTA SEÇÃO ---
    @OneToMany(() => QuizAttempt, attempt => attempt.quiz)
    attempts: QuizAttempt[];
    // ---------------------------
}