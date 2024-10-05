import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(articleId: string, authorId: string, content: string) {
    // Перевірка, чи існує пост
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Створення коментаря
    return this.prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
        author: { connect: { id: authorId } },
      },
    });
  }

  async updateComment(
    commentId: string,
    content: string,
    currentUserId: string,
  ) {
    return await this.prisma.comment.update({
      where: { id: commentId, authorId: currentUserId },
      data: { content },
    });
  }

  async getCommentsByArticle(articleId: string) {
    return this.prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
        likes: true,
      },
    });
  }

  async deleteComment(commentId: string, currentUserId: string) {
    return await this.prisma.comment.delete({
      where: { id: commentId, authorId: currentUserId },
    });
  }
}
