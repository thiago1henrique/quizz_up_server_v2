import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './entities/user.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      database: join(__dirname, '..', 'database.sqlite'),
      entities: [User, Quiz, QuizAttempt],
      synchronize: true, 
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: '/uploads', 
    }),
    UsersModule,
    QuizzesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {}