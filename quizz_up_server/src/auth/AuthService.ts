// src/auth/AuthService.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
// Não precisa mais importar bcrypt

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // Comparação direta de strings (MUITO INSEGURO!)
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // O método login permanece o mesmo, adicionando a 'role'
  async login(userFromValidate: any) {
    const payloadForToken = {
      email: userFromValidate.email,
      sub: userFromValidate.id,
      name: userFromValidate.name,
      role: userFromValidate.role, // <-- Adiciona a role
    };

    const userToReturn = {
      id: userFromValidate.id,
      name: userFromValidate.name,
      email: userFromValidate.email,
      role: userFromValidate.role, // <-- Adiciona a role
    };

    return {
      access_token: this.jwtService.sign(payloadForToken),
      user: userToReturn,
    };
  }
}