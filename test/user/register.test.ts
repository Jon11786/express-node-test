import {
  describe, it, expect, beforeAll, afterAll,
} from 'vitest';
import superagent from 'superagent';
import { Server } from 'node:net';
import app from '../../src';

let server: Server;
let baseUrl: string;

describe('POST /register', () => {
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
    const payload = { name: 'Jeff', email: 'jeff@example.com', password: '123' };

    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .ok(() => true);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: payload.name,
      email: payload.email,
    });
    expect(response.body).not.toHaveProperty('password');
  });

  it('returns 400 on malformed data', async () => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send('{name:');

    expect(response.status).toBe(400);
  });

  it('returns 415 on unsupported media', async () => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'xml/json')
      .send('<user><name>Jeff</name><email>jeff@example.com</email><password>123</password></user>');

    expect(response.status).toBe(415);
  });

  it('returns 422 on missing data', async () => {
    const payload = { name: '', email: 'not-an-email', password: '1' };

    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(response.status).toBe(422);
  });
});
