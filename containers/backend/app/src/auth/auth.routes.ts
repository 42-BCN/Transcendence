import { Router } from 'express';

import { localRouter } from './local/local.routes';
import { oauthRouter } from './oauth/oauth.routes';
import { recoveryRouter } from './recovery/recovery.routes';
import { verificationRouter } from './verification/verification.routes';

export const authRouter = Router();

authRouter.use(localRouter);
authRouter.use(recoveryRouter);
authRouter.use(verificationRouter);
authRouter.use(oauthRouter);
