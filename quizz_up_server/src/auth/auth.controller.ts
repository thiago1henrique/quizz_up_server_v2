// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './AuthService'; // Importa AuthService

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // Injeta AuthService

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // 1. Valida o usuário
    const user = await this.authService.validateUser(body.email, body.password);

    // 2. Se não for válido, lança erro
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Se for válido, chama o login do AuthService (que retorna o token)
    return this.authService.login(user); 
  }
}