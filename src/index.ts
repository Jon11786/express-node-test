import express, { Express } from 'express';
import routes from './routes';
import requireContentTypeJson from './middleware/content-type.middleware';

const app: Express = express();

app.use(requireContentTypeJson);

app.use(express.json());

app.use('', routes);

export default app;
