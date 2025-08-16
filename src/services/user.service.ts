import { hash } from 'argon2';
import { CreatedUser, NewUser } from '../types/user';
import { createUser } from '../repositories/user.repository';

export async function create(input: NewUser): Promise<CreatedUser> {
  const passwordHash = await hash(input.password);

  const user: NewUser = {
    name: input.name,
    email: input.email,
    password: passwordHash,
    type: input.type,
  };

  const createdUser = await createUser(user);
  return createdUser;
}

export async function findById(id: number): Promise<CreatedUser> {
  const user = findById(id);
  return user;
}
