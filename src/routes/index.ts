import { Router } from 'express';
import user from './user.routes';

const routes = Router();

// mount each resource router on its path
routes.use('/user', user);

export default routes;
