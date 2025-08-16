import {
  describe, it, expect, beforeAll, afterAll,
} from 'vitest';
import superagent from 'superagent';
import { Server } from 'node:net';
import { faker } from '@faker-js/faker';
import app from '../../../src';
import db from '../../../src/db/connection';
import { CreatedUser, NewUser } from '../../../src/types/user';

let server: Server;
let baseUrl: string;

describe('Get /user/:id', () => {
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

  it('returns 200 and returns user', async () => {
    const payload = {
      name: faker.person.fullName(), email: faker.internet.email(), password: faker.internet.password(), type: 'student',
    };

    const insertStatement = db.prepare<NewUser, CreatedUser>('INSERT INTO users (name, email, password, type) VALUES (@name, @email, @password, @type) RETURNING id, name, email, type');

    const user = insertStatement.get(payload);

    const response = await superagent
      .get(`${baseUrl}/user/${user?.id}`)
      .set('Content-Type', 'application/json')
      .ok(() => true);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(payload.name);
    expect(response.body.email).toBe(payload.email);
    expect(response.body.type).toBe(payload.type);
  });

  it('returns 404 if user not found', async () => {
    const id = 900;

    const response = await superagent
      .get(`${baseUrl}/user/${id}`)
      .set('Content-Type', 'application/json')
      .ok(() => true);

    expect(response.status).toBe(404);
  });
});
