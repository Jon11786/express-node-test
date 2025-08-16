import { Request, Response } from 'express';
import RegisterSchema from '../validation/register.schema';

// eslint-disable-next-line import/prefer-default-export
export async function register(req: Request, res: Response) {
  const parsedParams = RegisterSchema.safeParse(req.body);

  if (!parsedParams.success) {
    return res.status(422).json({ errors: parsedParams.error.issues });
  }

  return res.status(201).json(parsedParams);
}
