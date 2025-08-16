// middleware/contentType.ts
import type { Request, Response, NextFunction } from 'express';

const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

function requireContentTypeJson(req: Request, res: Response, next: NextFunction) {
  if (methods.indexOf(req.method) === -1 || !req.headers['content-length']) {
    return next();
  }
  // If you only want to enforce when a body is present:
  const ct = String(req.headers['content-type'] || '');
  if (!/^\s*application\/json\b/i.test(ct)) {
    return res.status(415).json({ error: 'Unsupported media type. Use application/json.' });
  }
  return next();
}

export default requireContentTypeJson;
