import { Router } from 'express';
import { get } from '../controllers/user.controller';

const router = Router();

router.get('/:id', get);

export default router;
