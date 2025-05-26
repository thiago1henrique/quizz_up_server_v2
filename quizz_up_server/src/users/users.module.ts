// src/users/users.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- 1. Importe forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      forwardRef(() => AuthModule) // <-- 2. Use forwardRef aqui
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}