import {
  describe, it, expect, beforeAll, afterAll, test,
} from 'vitest';
import superagent from 'superagent';
import { Server } from 'node:net';
import { verify } from 'argon2';
import { faker } from '@faker-js/faker';
import app from '../../../src';
import db from '../../../src/db/connection';

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
    const payload = {
      name: faker.person.fullName(), email: faker.internet.email(), password: 'Abcdefg1', type: 'student', created: faker.date.anytime().toString(),
    };

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
      type: payload.type,
      created: payload.created,
    });
    expect(response.body).not.toHaveProperty('password');

    const row = db.prepare<{ id: number }, { id: number; password: string }>('SELECT id, password FROM users WHERE id = ?').get(response.body.id);
    expect(row).toBeDefined();
    expect(row!.password).not.toBe(payload.password);
    const verified = await verify(row!.password, payload.password);
    expect(verified).toBe(true);
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

  const cases: [string, any, string][] = [
    ['missing name', {
      email: 'x@example.com', password: 'Abcdefg1', type: 'student', created: faker.date.anytime().toString(),
    }, 'Invalid input: expected string, received undefined'],
    ['bad email', {
      name: 'Jeff', email: 'not-an-email', password: 'Abcdefg1', type: 'student', created: faker.date.anytime().toString(),
    }, 'Invalid email address'],
    ['weak password', {
      name: 'Jeff', email: 'j@example.com', password: 'abc', type: 'student', created: faker.date.anytime().toString(),
    }, 'Too small: expected string to have >=8 characters'],
    ['bad type', {
      name: 'Jeff', email: 'j@example.com', password: 'Abcdefg1', type: 'baker', created: faker.date.anytime().toString(),
    }, 'Invalid option: expected one of "student"|"teacher"|"parent"|"private_tutor"'],
  ];

  test.each(cases)('%s returns status 422', async (_label, payload, errorMessage) => {
    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload).ok(() => true);

    expect(response.status).toBe(422);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe(errorMessage);
  });

  it('returns 422 on existing email', async () => {
    const payload = {
      name: faker.person.fullName(), email: faker.internet.email(), password: 'Abcdefg1', type: 'student', created: faker.date.anytime().toString(),
    };

    const insertStatement = db.prepare('INSERT INTO users (name, email, password, type, created) VALUES (@name, @email, @password, @type, @created) RETURNING id, name, email, type, created');

    insertStatement.get(payload);

    const response = await superagent
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .ok(() => true);

    expect(response.status).toBe(422);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Invalid registration data.');
  });
});
