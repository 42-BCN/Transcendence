"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RES_ERRORS = void 0;
const auth_errors_1 = require("../auth/auth.errors");
const users_errors_1 = require("../users/users.errors");
const friendships_errors_1 = require("../friendships/friendships.errors");
const game_invitations_errors_1 = require("../game-invitations/game-invitations.errors");
const status_1 = require("./status");
const validation_1 = require("./validation");
exports.RES_ERRORS = {
    // Auth module errors
    ...auth_errors_1.AUTH_ERRORS,
    ...users_errors_1.USERS_ERRORS,
    ...friendships_errors_1.FRIENDSHIPS_ERROR_STATUS,
    ...game_invitations_errors_1.GAME_INVITATIONS_ERROR_STATUS,
    INTERNAL_ERROR: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    // Global errors
    ...validation_1.VALIDATION_ERROR,
};
