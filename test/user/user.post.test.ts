import {
  describe, it, expect, beforeAll, afterAll,
} from 'vitest';
import superagent from 'superagent';
import { Server } from 'node:net';
import app from '../../src';

let server: Server;
let baseUrl: string;

describe('POST /user', () => {
  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => { server.once('listening', resolve); });
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 0;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => { server.close(() => resolve()); });
  });

  it('returns 201 and created user', async () => {
    const response = await superagent.post(`${baseUrl}/user`).send({ name: 'Jeff', email: 'jeff@example.com', password: '123' });

    expect(response.status).toBe(201);
  });
});
