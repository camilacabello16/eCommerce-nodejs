'use strict'

const StatusCode = {
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    CONFLICT: 409
}

const StatusCodeReason = {
    BAD_REQUEST: 'Bad request',
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Conflict'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = StatusCodeReason.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = StatusCodeReason.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = StatusCodeReason.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

module.exports = {
    BadRequestError,
    ForbiddenError,
    ConflictError
}