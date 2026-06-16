"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ERRORS = void 0;
const status_1 = require("../http/status");
const http_1 = require("../http");
exports.AUTH_ERRORS = {
    // Auth module errors
    AUTH_RATE_LIMITED: status_1.HttpStatus.TOO_MANY_REQUESTS,
    AUTH_UNAUTHORIZED: status_1.HttpStatus.UNAUTHORIZED,
    AUTH_FORBIDDEN: status_1.HttpStatus.FORBIDDEN,
    AUTH_INVALID_CREDENTIALS: status_1.HttpStatus.UNAUTHORIZED,
    AUTH_EMAIL_ALREADY_EXISTS: status_1.HttpStatus.CONFLICT,
    AUTH_EMAIL_NOT_VERIFIED: status_1.HttpStatus.FORBIDDEN,
    AUTH_RESEND_VERIFICATION_NOT_FOUND: status_1.HttpStatus.NOT_FOUND,
    AUTH_RESEND_VERIFICATION_COOLDOWN: status_1.HttpStatus.TOO_MANY_REQUESTS,
    AUTH_TOKEN_EXPIRED: status_1.HttpStatus.UNAUTHORIZED,
    AUTH_CSRF_FAILED: status_1.HttpStatus.FORBIDDEN,
    AUTH_INTERNAL_ERROR: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    AUTH_GOOGLE_USER_INSERT_FAILED: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    AUTH_GOOGLE_LINK_FAILED: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    INTERNAL_ERROR: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    FETCH_FAILED: status_1.HttpStatus.BAD_GATEWAY,
    // Global errors
    ...http_1.VALIDATION_ERROR,
};
