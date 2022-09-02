class CustomException extends Error {
    name;
    message;
    statusCode;

    constructor(message, statusCode = 500) {
        super(message);

        this.name = 'CustomException';
        this.message = message;
        this.statusCode = statusCode;
    }
}

/**
 * @property statusCode 400
 */
class BadRequestException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'BadRequestException';
        this.statusCode = 400;
    }
}

/**
 * @property statusCode 401
 */
class UnauthorizedException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'UnauthorizedException';
        this.statusCode = 401;
    }
}

/**
 * @property statusCode 403
 */
class ForbiddenException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'ForbiddenException';
        this.statusCode = 403;
    }
}

/**
 * @property statusCode 404
 */
class NotFoundException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'NotFoundException';
        this.statusCode = 404;
    }
}

/**
 * @property statusCode 409
 */
class ConflictException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'ConflictException';
        this.statusCode = 409;
    }
}

/**
 * @property statusCode 500
 */
class UnkownException extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'UnkownException';
        this.statusCode = 500;
    }
}

/**
 * @property statusCode 500
 */
class UnhandleMysqlSequelizeError extends CustomException {
    constructor(message) {
        super(message);

        this.name = 'UnhandleMysqlSequelizeError';
        this.statusCode = 500;
    }
}

module.exports = {
    CustomException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    UnkownException,
    UnhandleMysqlSequelizeError
};
