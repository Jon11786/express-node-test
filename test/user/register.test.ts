import {
  describe, it, expect, beforeAll, afterAll, test,
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
    const payload = { name: 'Jeff', email: 'jeff@example.com', password: '1234abcdT' };

    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .ok(() => true);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: payload.name,
      email: payload.email,
    });
    expect(response.body).not.toHaveProperty('password');
  });

  it('returns 400 on malformed data', async () => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send('{name:')
      .ok(() => true);

    expect(response.status).toBe(400);
  });

  it('returns 415 on unsupported media', async () => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'xml/json')
      .send('<user><name>Jeff</name><email>jeff@example.com</email><password>123</password></user>')
      .ok(() => true);

    expect(response.status).toBe(415);
  });

  const cases: [string, any][] = [
    ['missing name', { email: 'x@example.com', password: 'Abcdefg1' }],
    ['bad email', { name: 'Jeff', email: 'not-an-email', password: 'Abcdefg1' }],
    ['weak password', { name: 'Jeff', email: 'j@example.com', password: 'abc' }],
  ];

  test.each(cases)('%s returns status 422', async (_label, payload) => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload).ok(() => true);

    expect(response.status).toBe(422);
  });
});
