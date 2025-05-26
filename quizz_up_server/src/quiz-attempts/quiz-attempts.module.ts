// src/quiz-attempts/quiz-attempts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
// Não precisa de service e controller aqui se QuizzesService lida com isso

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt])],
  exports: [TypeOrmModule], // Exporta para que QuizzesModule possa injetar o Repository
})
export class QuizAttemptsModule {}