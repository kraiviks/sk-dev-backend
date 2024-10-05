import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async togglePostLike(articleId: string, userId: string): Promise<any> {
    const existingLike = await this.prisma.like.findFirst({
      where: {
        articleId,
        userId,
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { message: 'Post unliked successfully', status: HttpStatus.OK };
    } else {
      await this.prisma.like.create({
        data: {
          articleId,
          userId,
        },
      });
      return {
        message: 'Post liked successfully',
        status: HttpStatus.CREATED,
      };
    }
  }

  async toggleCommentLike(commentId: string, userId: string): Promise<any> {
    const existingLike = await this.prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (existingLike) {
      return await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      return await this.prisma.like.create({
        data: {
          commentId,
          userId,
        },
      });
    }
  }

  async getArticleLikes(articleId: string) {
    return this.prisma.like.findMany({
      where: { articleId },
    });
  }

  async getCommentLikes(commentId: string) {
    return this.prisma.like.findMany({
      where: { commentId },
    });
  }

  async findOne(id: string) {
    return this.prisma.like.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.like.delete({
      where: { id },
    });
  }
}
