import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { publicUserSelect } from './user.select'
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: publicUserSelect,
    })
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: publicUserSelect,
    })
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  findPublicById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    })
  }
}
