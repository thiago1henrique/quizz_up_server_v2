// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Injeta o JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // !! IMPORTANTE: Em produção, NUNCA compare senhas em texto plano. Use bcrypt. !!
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userFromValidate: any) {
      const payloadForToken = { 
          email: userFromValidate.email, 
          sub: userFromValidate.id, // 'sub' para o token JWT
          name: userFromValidate.name 
      };

      // Objeto user para retornar ao frontend com 'id'
      const userToReturn = {
          id: userFromValidate.id, // <-- GARANTA QUE 'id' ESTÁ AQUI
          name: userFromValidate.name,
          email: userFromValidate.email,
      };

      return {
        access_token: this.jwtService.sign(payloadForToken),
        user: userToReturn // <-- Retorna o objeto com 'id'
      };
  }
}