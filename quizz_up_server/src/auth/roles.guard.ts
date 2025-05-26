import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Se nenhuma role é requisitada, permite o acesso
    }
    const { user } = context.switchToHttp().getRequest();
    // user é populado pelo JwtStrategy e deve conter a 'role'
    return requiredRoles.some((role) => user?.role === role);
  }
}