import { Request } from 'express';
import { User } from '@prisma/client';

export interface ExpressRequestInterface extends Request {
  user?: User;
}
