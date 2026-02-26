import { Body, Controller, Get, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Role } from '@/generated/prisma/enums';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.usersService.findAll()
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body)
  }
}