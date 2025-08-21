import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </head>
      <body>
        <div id="redoc-container"></div>
        <script>
          Redoc.init('/openapi.yaml', {}, document.getElementById('redoc-container'));
        </script>
      </body>
    </html>
  `);
});

export default router;
