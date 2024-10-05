import { Controller, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserId } from './decorators/userId.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  @UseGuards(AuthGuard)
  currentUser(@GetUserId() currentUserId: string) {
    return this.usersService.findOne(currentUserId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(
    @GetUserId() currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateCurrentUser(currentUserId, updateUserDto);
  }
}
