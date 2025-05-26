import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from '../entities/quiz.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizAttempt]),
    AuthModule, 

  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}