import { Router } from 'express';
import user from './user.routes';
import register from './register.routes';

const routes = Router();

// Split routes into user and register incase we want different middlewares or logic in the future
routes.use('/user', user);
routes.use('/register', register);

export default routes;
