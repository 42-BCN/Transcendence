"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_USERS_ERRORS = exports.USERS_ERRORS = void 0;
const status_1 = require("../http/status");
const http_1 = require("../http");
exports.USERS_ERRORS = {
    INTERNAL_ERROR: status_1.HttpStatus.INTERNAL_SERVER_ERROR,
    USER_NOT_FOUND: status_1.HttpStatus.NOT_FOUND,
    AUTH_UNAUTHORIZED: status_1.HttpStatus.UNAUTHORIZED,
    AUTH_RATE_LIMITED: status_1.HttpStatus.TOO_MANY_REQUESTS,
    ...http_1.VALIDATION_ERROR,
};
exports.SEARCH_USERS_ERRORS = [
    'INTERNAL_ERROR',
    'VALIDATION_ERROR',
    'AUTH_UNAUTHORIZED',
    'AUTH_RATE_LIMITED',
];
