import { Module } from '@nestjs/common';
import { AppController } from './modules/app.controller';
import { AppService } from './modules/app.service';
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy/jwt.strategy';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
