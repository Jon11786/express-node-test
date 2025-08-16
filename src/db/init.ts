import db from './connection';

function initSchema() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS users(
            id int PRIMARY KEY,
            name varchar NOT NULL,
            email varchar NOT NULL UNIQUE,
            password varchar NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);
    `);
}

export default initSchema;
