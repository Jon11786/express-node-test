import { z } from 'zod';

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
});

export default registerSchema;
