class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Bad Request";
    this.statusCode = 400;
  }
}


class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Unauthorized";
    this.statusCode = 401;
  }
}


class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Forbidden";
    this.statusCode = 403;
  }
}


class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Conflict";
    this.statusCode = 409;
  }
}


class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.message = message || "Not Found";
    this.statusCode = 404;
  }
}


module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
};
