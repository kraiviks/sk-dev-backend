import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUserId } from '../users/decorators/userId.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('articles/:articleId')
  @UseGuards(AuthGuard)
  async togglePostLike(
    @Param('articleId') articleId: string,
    @GetUserId('id') currentUserId: string,
  ): Promise<any> {
    return await this.likesService.togglePostLike(articleId, currentUserId);
  }

  @Post('comments/:commentId')
  @UseGuards(AuthGuard)
  async toggleCommentLike(
    @Param('commentId') commentId: string,
    @GetUserId('id') currentUserId: string,
  ): Promise<any> {
    return await this.likesService.toggleCommentLike(commentId, currentUserId);
  }

  @Get('articles/:articleId')
  getArticleLikes(@Param('articleId') articleId: string) {
    return this.likesService.getArticleLikes(articleId);
  }

  @Get('comments/:commentId')
  getCommentLikes(@Param('commentId') commentId: string) {
    return this.likesService.getCommentLikes(commentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(id);
  }
}
