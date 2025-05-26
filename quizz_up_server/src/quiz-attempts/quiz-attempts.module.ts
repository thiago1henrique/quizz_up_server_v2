// src/quiz-attempts/quiz-attempts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAttempt } from '../entities/quiz-attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt])],
  exports: [TypeOrmModule],
})
export class QuizAttemptsModule {}