// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service'; // Pode ser útil se precisar buscar o usuário

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      // Se precisar validar o usuário no banco a cada request:
      // private usersService: UsersService 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do cabeçalho "Authorization: Bearer ..."
      ignoreExpiration: false, // Garante que tokens expirados serão rejeitados
      secretOrKey: jwtConstants.secret, // Usa a mesma chave secreta
    });
  }

  // Este método é chamado pelo Passport após validar a assinatura e a expiração do token.
  // O que ele retorna é o que será colocado em `req.user`.
  async validate(payload: any) {
    // 'payload' é o conteúdo decodificado do token JWT.
    // Você pode fazer buscas adicionais aqui se necessário (ex: buscar usuário no banco)
    // Se o usuário não existir mais, pode lançar uma exceção.
    
    // Simplesmente retorna o payload, que contém 'sub' (ID do usuário) e 'email'.
    // O `AuthGuard` vai adicionar isso ao `req.user`.
    // No seu QuizzesController, você acessa com `req.user.userId` (ajustado de `payload.sub`)
    return { userId: payload.sub, email: payload.email, name: payload.name }; 
  }
}