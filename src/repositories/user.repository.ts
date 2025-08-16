import db from '../db/connection';
import { CreatedUser, NewUser } from '../types/user';

const createUserStatement = db.prepare<NewUser, CreatedUser>('INSERT INTO users (name, email, password, type) VALUES (@name, @email, @password, @type) RETURNING id, name, email, type');
const findUserByIdStatement = db.prepare<[number], CreatedUser>('SELECT id, name, email, type FROM users WHERE id = ?');

export async function createUser(user: NewUser): Promise<CreatedUser> {
  return createUserStatement.get(user)!;
}

export async function findById(id: number): Promise<CreatedUser | null> {
  return findUserByIdStatement.get(id) ?? null;
}
