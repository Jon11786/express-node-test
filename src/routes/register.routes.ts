import { Request, Response, Router } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default router;
