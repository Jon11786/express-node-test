import { z } from 'zod';
import { userTypes } from '../types/user';

const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(8)
    .max(64)
    .regex(/[0-9]/, 'Must contain at least one digit (0-9)')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)'),
  type: z.enum(userTypes),
  created: z.iso.datetime({ offset: true }).transform((string) => new Date(string).toISOString()),
});

export default registerSchema;
