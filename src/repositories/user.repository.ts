import db from '../db/connection';
import { CreatedUser, NewUser } from '../types/user';

export async function createUser(user: NewUser): Promise<CreatedUser> {
  const createUserStatement = db.prepare<NewUser, CreatedUser>('INSERT INTO users (name, email, password, type, created) VALUES (@name, @email, @password, @type, @created) RETURNING id, name, email, type, created');
  return createUserStatement.get(user)!;
}

export async function findById(id: number): Promise<CreatedUser | null> {
  const findUserByIdStatement = db.prepare<[number], CreatedUser>('SELECT id, name, email, type, created FROM users WHERE id = ?');
  return findUserByIdStatement.get(id) ?? null;
}
