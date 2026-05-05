import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { RedisStore } from 'connect-redis';

import { errorMiddleware, getRedisClient } from '@shared';

import { usersRouter } from './users/users.routes';
import { protectedRouter } from './protected/protected.route';
import './auth/oauth/oauth.passport';
import { authRouter } from './auth/auth.routes';
import { friendsRouter } from './friendships/friendships.routes';
import { handleInternalFriendsList } from './friendships/friendships.presence';
import { authIpRateLimit } from './auth/auth.rate-limit';

// Ensure required environment variables are set
// TODO manage like in frontend with a env schema validator
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET is required');

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const SEVEN_DAYS_MS = ONE_DAY_MS * 7;

const app = express();

app.set('trust proxy', 1);

app.use(express.json());

app.use(
  session({
    store: new RedisStore({
      client: getRedisClient(),
      ttl: Math.floor(SEVEN_DAYS_MS / 1000),
      disableTouch: false,
    }),
    name: 'sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      sameSite: 'lax',
      path: '/',
      maxAge: SEVEN_DAYS_MS,
    },
  }),
);

app.use(passport.initialize());

app.get('/health', async (_req, res) => {
  try {
    await getRedisClient().ping();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});
app.use('/users', usersRouter);
app.use('/auth', authIpRateLimit, authRouter);
app.use('/protected', protectedRouter);
app.use('/friends', friendsRouter);

app.post('/internal/friends', handleInternalFriendsList);

app.use(errorMiddleware);

export default app;
