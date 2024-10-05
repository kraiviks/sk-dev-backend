import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetUserId } from '../users/decorators/userId.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':articleId')
  @UseGuards(AuthGuard)
  async createComment(
    @Param('articleId') articleId: string,
    @GetUserId('id') currentUserId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.createComment(
      articleId,
      currentUserId,
      content,
    );
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @GetUserId('id') currentUserId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.updateComment(
      commentId,
      content,
      currentUserId,
    );
  }

  @Get(':articleId')
  async getCommentsByArticle(@Param('articleId') articleId: string) {
    return this.commentsService.getCommentsByArticle(articleId);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUserId('id') currentUserId: string,
  ) {
    return this.commentsService.deleteComment(commentId, currentUserId);
  }
}
