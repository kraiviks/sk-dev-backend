import { Controller, Post, Param } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { GetUserId } from '../users/decorators/userId.decorator';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id/follow')
  follow(@Param('id') id: string, @GetUserId('id') currentUserId: string) {
    return this.followsService.follow(id, currentUserId);
  }

  @Post(':id/unfollow')
  unfollow(@Param('id') id: string, @GetUserId('id') currentUserId: string) {
    return this.followsService.unfollow(id, currentUserId);
  }
}
