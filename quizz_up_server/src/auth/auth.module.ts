import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Será importado com forwardRef
import { AuthService } from './AuthService';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
// Se RolesGuard for usado apenas aqui, pode ser provido aqui.
// Senão, se for usado globalmente ou em vários módulos, pode ser provido no AppModule ou em um CoreModule.
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule), // Para evitar dependência circular com UsersModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' }, // Token expira em 1 hora
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard, // Se o RolesGuard for usado por controllers neste módulo ou exportado
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, AuthService, RolesGuard], // Exporta para outros módulos usarem
})
export class AuthModule {}