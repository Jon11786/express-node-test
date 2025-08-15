import { Router } from 'express';
import user from './user.routes';
import register from './register.routes';

const routes = Router();

// mount each resource router on its path
routes.use('/user', user);
routes.use('/register', register);

export default routes;
