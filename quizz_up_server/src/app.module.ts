import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity'; // <-- 1. Importe a entidade QuizAttempt
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'database.sqlite'),
      entities: [
          User,
          Quiz,
          QuizAttempt // <-- 2. Adicione QuizAttempt à lista de entidades
      ],
      synchronize: true,
      logging: true,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    UsersModule,
    QuizzesModule,
    AuthModule,
  ],
})
export class AppModule {}