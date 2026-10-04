import { clearSession, issueSession, requireAuth } from '../middleware/auth.js';
import {
  createUser,
  findByIdentifier,
  toPublicUser,
} from '../models/user.model.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { unauthorized } from '../utils/http.js';
import { optionalString, requireEmail, requireString } from '../utils/validate.js';

export function authRoutes(router, db) {
  router.post('/api/auth/signup', (ctx) => {
    const username = requireString(ctx.body.username, 'username', {
      min: 3,
      max: 32,
    });
    const email = requireEmail(ctx.body.email);
    const password = requireString(ctx.body.password, 'password', {
      min: 5,
      max: 128,
    });
    const name = optionalString(ctx.body.name, 'name', { max: 64 });
    const email1 = ctx.body.email1
      ? requireEmail(ctx.body.email1, 'email1')
      : undefined;

    const user = createUser(db, {
      username,
      email,
      password: hashPassword(password),
      name,
      email1,
    });

    return { user: toPublicUser(user), token: issueSession(ctx.res, user) };
  });

  router.post('/api/auth/login', (ctx) => {
    const identifier = requireString(
      ctx.body.identifier ?? ctx.body.username ?? ctx.body.email,
      'identifier',
      { max: 254 }
    );
    const password = requireString(ctx.body.password, 'password', {
      max: 128,
    });

    const row = findByIdentifier(db, identifier);
    if (!row || !verifyPassword(password, row.password)) {
      throw unauthorized('Invalid credentials');
    }

    return { user: toPublicUser(row), token: issueSession(ctx.res, row) };
  });

  router.post('/api/auth/logout', (ctx) => {
    clearSession(ctx.res);
  });

  router.get('/api/auth/me', (ctx) => ({ user: requireAuth(ctx) }));
}
