import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants'; // Seu arquivo de constantes com o segredo

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // O que é retornado aqui será anexado a `req.user`
    return {
      userId: payload.sub,    // 'sub' geralmente é o ID do usuário
      email: payload.email,
      name: payload.name,     // Se você incluir 'name' no payload do token
      role: payload.role,     // A role do usuário, vinda do token
    };
  }
}