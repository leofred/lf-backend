import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt/jwt.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { LoginDto } from './dto'
import { UsersService } from '@/modules/users/users.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@CurrentUser('userId') userId: string) {
    return this.authService.refresh(userId)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser('userId') userId: string) {
    return this.usersService.findPublicById(userId)
  }
}
