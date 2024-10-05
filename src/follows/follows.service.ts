import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(id: string, currentUserId: string) {
    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: id,
      },
    });
    if (existingFollow) {
      return {
        message: 'Already followed',
        status: HttpStatus.OK,
      };
    }

    // Create a new follow
    await this.prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: id,
      },
    });
    return {
      message: 'Followed successfully',
      status: HttpStatus.CREATED,
    };
  }

  async unfollow(id: string, currentUserId: string) {
    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: id,
      },
    });
    if (!existingFollow) {
      return {
        message: 'Not followed',
        status: HttpStatus.OK,
      };
    }

    await this.prisma.follow.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: id,
      },
    });

    return {
      message: 'Unfollowed successfully',
      status: HttpStatus.OK,
    };
  }
}
