import { CreatedUser, NewUser } from '../types/user';
import { createUser } from '../repositories/user.repository';

export async function create(input: NewUser): Promise<CreatedUser> {
  const user: NewUser = {
    name: input.name,
    email: input.email,
    password: input.password,
  };

  const createdUser = await createUser(user);
  return createdUser;
}

export async function findById(id: number): Promise<CreatedUser> {
  const user = findById(id);
  return user;
}
