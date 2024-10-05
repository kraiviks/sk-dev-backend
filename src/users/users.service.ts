import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Partial<User>[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,

        password: false,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        articles: true,
        comments: true,
        likes: true,
        followers: true,
        following: true,
      },
    });

    delete user.password;
    return user;
  }

  async updateCurrentUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
    return this.buildResponse(user);
  }

  buildResponse(user: User): UserResponseInterface {
    delete user.password;
    return user;
  }
}
