import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { Article, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUserId: string,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    const article = await this.prisma.article.create({
      data: {
        ...createArticleDto,
        slug: this.getSlug(createArticleDto.title),
        author: {
          connect: { id: currentUserId },
        },
      },
    });

    return article;
  }

  async findAll(query: any): Promise<Article[]> {
    try {
      const conditions: Prisma.ArticleWhereInput = {};

      const take = query.limit ? parseInt(query.limit, 10) : undefined;
      const skip = query.offset ? parseInt(query.offset, 10) : undefined;

      if (query.search) {
        conditions.title = {
          contains: query.search,
          mode: 'insensitive',
        };
      }

      if (query.author) {
        conditions.author = {
          username: {
            contains: query.author,
            mode: 'insensitive',
          },
        };
      }

      return await this.prisma.article.findMany({
        where: conditions,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      });
    } catch (error) {
      throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);
    }
  }

  async getBySlug(slug: string) {
    const article = await this.prisma.article.findFirstOrThrow({
      where: { slug },
      include: {
        author: true,
        likes: true,
      },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    delete article.author.password;
    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: string,
  ) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (article.authorId !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    try {
      return await this.prisma.article.update({
        where: { id },
        data: updateArticleDto,
      });
    } catch (error) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string, currentUserId: string) {
    try {
      const article = await this.prisma.article.findUnique({ where: { id } });

      if (currentUserId !== article.authorId) {
        throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
      }

      await this.prisma.article.delete({
        where: { id },
      });

      return { message: 'Article deleted successfully', status: HttpStatus.OK };
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);
      }
      return error;
    }
  }

  private getSlug(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
