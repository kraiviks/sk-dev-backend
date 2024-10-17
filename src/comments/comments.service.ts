import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    articleId: string,
    authorId: string,
    content: string,
    parentId?: string,
  ) {
    // Check if article exists
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if parent comment exists, if parentId is provided
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    // Create comment
    return this.prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
        author: { connect: { id: authorId } },
        parent: parentId ? { connect: { id: parentId } } : undefined, // Link to parent comment
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
    // Get all comments for article
    const comments = await this.prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Recursive function to structure comments
    const buildTree = (comments: any[]): any[] => {
      const map = new Map();
      comments.forEach((comment) =>
        map.set(comment.id, { ...comment, replies: [] }),
      );

      const tree: any[] = [];
      comments.forEach((comment) => {
        if (comment.parentId) {
          const parent = map.get(comment.parentId);
          if (parent) {
            parent.replies.push(map.get(comment.id));
          }
        } else {
          tree.push(map.get(comment.id));
        }
      });
      return tree;
    };

    return buildTree(comments);
  }

  async deleteComment(commentId: string, currentUserId: string) {
    // Find comment to delete
    const commentToDelete = await this.prisma.comment.findUnique({
      where: { id: commentId, authorId: currentUserId },
    });

    // Check if comment exists
    if (!commentToDelete) {
      throw new NotFoundException(
        'Comment not found or you do not have permission to delete it',
      );
    }

    // Delete comment and its children
    await this.prisma.$transaction(async (prisma) => {
      // Delete all child comments
      await prisma.comment.deleteMany({
        where: {
          parentId: commentId,
        },
      });

      // Delete parent comment
      await prisma.comment.delete({
        where: { id: commentId },
      });
    });
  }
}
