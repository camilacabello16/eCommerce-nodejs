'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const StatusCodeReason = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, statusCodeReason = StatusCodeReason.OK, metadata = {} }) {
        this.message = !message ? statusCodeReason : message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json(this);
    }
}

class Ok extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata);
    }
}

class Created extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, statusCodeReason = StatusCodeReason.CREATED, metadata }) {
        super({ message, statusCode, statusCodeReason, metadata });
    }
}

module.exports = {
    Ok, Created
}