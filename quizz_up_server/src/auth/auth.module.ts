// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- 1. Importe forwardRef
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './AuthService';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule), // <-- 2. Use forwardRef aqui
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule]
})
export class AuthModule {}