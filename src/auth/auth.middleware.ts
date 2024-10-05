import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.usersService.findOne(decode['id']);
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
