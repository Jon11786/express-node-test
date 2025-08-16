import app from './index';
import initSchema from './db/init';

const port = process.env.PORT || 3000;

initSchema();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
