import { Request, Response, NextFunction } from 'express';
import RegisterSchema from '../validation/register.schema';
import { create } from '../services/user.service';

// eslint-disable-next-line import/prefer-default-export
export async function register(req: Request, res: Response, next: NextFunction) {
  const parsedParams = RegisterSchema.safeParse(req.body);

  if (!parsedParams.success) {
    return res.status(422).json({ errors: parsedParams.error.issues });
  }

  try {
    const newUser = await create(parsedParams.data);
    return res.status(201).json(newUser);
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(422).json({ errors: [{ message: 'Invalid registration data.' }] });
    }
    return next(error);
  }
}
