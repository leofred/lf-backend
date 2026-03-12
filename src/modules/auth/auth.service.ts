import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { createHash } from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // Login: retorna access + refresh
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: user.id, role: user.role }

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Armazena hash do refresh token no banco
    const hashedRefresh = this.hashRefreshToken(refresh_token);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return { sub: user.id, access_token, refresh_token }
  }

  // Refresh: gera novo access token
  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const hashedIncomingRefreshToken = this.hashRefreshToken(refreshToken);

    const isRefreshTokenValid = hashedIncomingRefreshToken === user.refreshToken;

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, role: user.role }

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' })
    const new_refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' })


    const hashedRefreshToken = this.hashRefreshToken(new_refresh_token);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      sub: user.id,
      access_token,
      refresh_token: new_refresh_token,
    }
  }


  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })

    return { message: 'Logged out successfully' }
  }

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}