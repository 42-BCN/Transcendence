import { Router } from "express";
import { validateBody, validateParams, requireAuth } from "@shared";
import {
  SendFriendRequestBodySchema,
  AcceptRequestParamSchema,
} from "@contracts/friendships/friendships.validation";

import {
  getFriendshipsController,
  getReceivedRequestsController,
  getSentRequestsController,
  sendFriendRequestController,
  acceptRequestController,
} from "./friendships.controller";

export const friendshipsRouter = Router();

friendshipsRouter.use(requireAuth);

friendshipsRouter.get("/", getFriendshipsController);

friendshipsRouter.get("/requests/received", getReceivedRequestsController);

friendshipsRouter.get("/requests/sent", getSentRequestsController);

friendshipsRouter.post(
  "/request",
  validateBody(SendFriendRequestBodySchema),
  sendFriendRequestController,
);

friendshipsRouter.post(
  "/requests",
  validateBody(SendFriendRequestBodySchema),
  sendFriendRequestController,
);

friendshipsRouter.patch(
  "/requests/:requestId/accept",
  validateParams(AcceptRequestParamSchema),
  acceptRequestController,
);
