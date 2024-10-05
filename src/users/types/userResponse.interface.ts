import { User } from '@prisma/client';

export interface UserResponseInterface extends Omit<User, 'password'> {}
