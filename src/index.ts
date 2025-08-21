import express, { Express } from 'express';
import path from 'path';
import routes from './routes';
import requireContentTypeJson from './middleware/content-type.middleware';

const app: Express = express();

app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/openapi.yaml'));
});

app.use(requireContentTypeJson);

app.use(express.json());

app.use('', routes);

export default app;
