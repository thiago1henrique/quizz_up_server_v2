import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizAttempt)
    private quizAttemptRepository: Repository<QuizAttempt>,
  ) {}

  // ... (outros métodos: create, findAll, findByUserId, findOne) ...

  async create(quizData: Partial<Quiz>): Promise<Quiz> {
    const quiz = this.quizzesRepository.create(quizData);
    return this.quizzesRepository.save(quiz);
  }

  findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.find();
  }

  findByUserId(userId: number): Promise<Quiz[]> {
    return this.quizzesRepository.find({ where: { userId } });
  }

  async findOne(id: number): Promise<Quiz | null> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
    });
    if (!quiz) {
      return null;
    }
    return quiz;
  }

  // --- MÉTODO CORRIGIDO ---
  async createResult(data: {
    score: number;
    totalQuestions: number;
    userId: number;   // ID do usuário
    quizId: number;   // ID do quiz
    // quizTitle e quizLogo removidos, pois não pertencem à QuizAttempt
  }): Promise<QuizAttempt> {

    // Opcional, mas recomendado: Verificar se User e Quiz existem antes de criar.
    // const user = await this.usersRepository.findOne({ where: { id: data.userId } });
    // const quiz = await this.quizzesRepository.findOne({ where: { id: data.quizId } });
    // if (!user || !quiz) {
    //   throw new NotFoundException('Usuário ou Quiz não encontrado.');
    // }

    // Cria uma nova instância de QuizAttempt passando as relações por ID
    const newAttempt = this.quizAttemptRepository.create({
      score: data.score,
      totalQuestions: data.totalQuestions,
      user: { id: data.userId }, // <-- Passa a relação User por ID
      quiz: { id: data.quizId }, // <-- Passa a relação Quiz por ID
      createdAt: new Date(),     // <-- Define a data manualmente (ou use @CreateDateColumn na entidade)
    });

    // Salva a nova tentativa no banco de dados
    return this.quizAttemptRepository.save(newAttempt);
  }
}