import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity'; 

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizAttempt) 
    private quizAttemptRepository: Repository<QuizAttempt>,
  ) {}

  async create(quizData: Partial<Quiz>): Promise<Quiz> {
    const newQuiz = this.quizzesRepository.create(quizData);
    return this.quizzesRepository.save(newQuiz);
  }

  findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.find();
  }

  async findOne(id: number): Promise<Quiz | null> {
    const quiz = await this.quizzesRepository.findOne({ where: { id } });
    if (!quiz) {
      return null; 
    }
    return quiz;
  }

  async update(id: number, updateData: Partial<Quiz>): Promise<Quiz> {
    const quiz = await this.quizzesRepository.preload({
      id: id,
      ...updateData,
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz com ID ${id} não encontrado para atualização.`);
    }
    return this.quizzesRepository.save(quiz);
  }

  async remove(id: number): Promise<void> {
    const result = await this.quizzesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Quiz com ID ${id} não encontrado para exclusão.`);
    }
    console.log(`Quiz com ID ${id} foi deletado.`);
  }

  async createResult(data: {
    score: number;
    totalQuestions: number;
    userId: number;
    quizId: number;
  }): Promise<QuizAttempt> {
    const newAttempt = this.quizAttemptRepository.create({
      score: data.score,
      totalQuestions: data.totalQuestions,
      user: { id: data.userId },
      quiz: { id: data.quizId },
      createdAt: new Date(),
    });
    return this.quizAttemptRepository.save(newAttempt);
  }
}