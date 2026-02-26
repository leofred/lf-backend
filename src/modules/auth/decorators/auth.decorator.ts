import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { Roles } from './roles.decorator';
import { Role } from '@/generated/prisma/client';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),        // adiciona metadata de roles
    UseGuards(JwtAuthGuard, RolesGuard), // guarda JWT + roles
  );
}