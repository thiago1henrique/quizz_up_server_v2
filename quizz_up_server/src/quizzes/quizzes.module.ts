// src/quizzes/quizzes.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- 1. Importe forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from '../entities/quiz.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Quiz, QuizAttempt]),
      UsersModule,
      forwardRef(() => AuthModule) // <-- 2. Use forwardRef aqui
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}