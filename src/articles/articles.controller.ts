import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetUserId } from '../users/decorators/userId.decorator';
import { Article } from '@prisma/client';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @GetUserId() currentUserId: string,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(currentUserId, createArticleDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<Article[]> {
    return await this.articlesService.findAll(query);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<Article> {
    return await this.articlesService.getBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @GetUserId() currentUserId: string,
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.articlesService.update(
      articleId,
      updateArticleDto,
      currentUserId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @GetUserId('id') currentUserId: string,
  ) {
    return await this.articlesService.remove(id, currentUserId);
  }
}
