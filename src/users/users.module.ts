import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
