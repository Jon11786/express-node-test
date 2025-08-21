// middleware/contentType.ts
import type { Request, Response, NextFunction } from 'express';

const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Middleware to require the Content-Type header to be json as we only support JSON payloads.
 * Only checking endpoints that modify data, i.e. POST, PUT, PATCH, DELETE.
 * If the Content-Type is not application/json, it returns a 415 Unsupported Media Type response
 * @param req
 * @param res
 * @param next
 */
function requireContentTypeJson(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/docs' || req.path === '/openapi.yaml')
    {
        return next();
    }

    if (methods.indexOf(req.method) === -1 || !req.headers['content-length']) {
    return next();
  }
  const ct = String(req.headers['content-type'] || '');
  if (!/^\s*application\/json\b/i.test(ct)) {
    return res.status(415).json({ error: 'Unsupported media type. Use application/json.' });
  }
  return next();
}

export default requireContentTypeJson;
