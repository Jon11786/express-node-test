import { Request, Response } from 'express';
import { findUserById } from '../services/user.service';

// Add this as you would expect more exports to be in here in a full application
// eslint-disable-next-line import/prefer-default-export
export async function get(req: Request, res: Response) {
  const user = await findUserById(parseInt(req.params?.id, 10));
  if (user === null) return res.status(404).send('No such user');

  return res.status(200).json(user);
}
