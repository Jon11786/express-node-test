import db from '../db/connection';
import { CreatedUser, NewUser } from '../types/user';

const createUserStatement = db.prepare<NewUser, CreatedUser>('INSERT INTO users (name, email, password) VALUES (@name, @email, @password) RETURNING id, name, email');
const findUserByIdStatement = db.prepare<[number], CreatedUser>('SELECT id, name, email FROM users WHERE id = ?');

export async function createUser(user: NewUser): Promise<CreatedUser> {
  return createUserStatement.get(user)!;
}

export async function findById(id: number): Promise<CreatedUser | null> {
  return findUserByIdStatement.get(id) ?? null;
}
