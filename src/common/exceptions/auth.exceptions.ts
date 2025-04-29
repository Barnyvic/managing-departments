import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      message: "Invalid username or password",
      error: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
}

export class UserNotFoundException extends UnauthorizedException {
  constructor(username: string) {
    super({
      message: `User ${username} not found`,
      error: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
}

export class UsernameAlreadyExistsException extends ConflictException {
  constructor(username: string) {
    super({
      message: `Username "${username}" is already taken`,
      error: "CONFLICT",
      statusCode: 409,
    });
  }
}

export class InvalidPasswordException extends BadRequestException {
  constructor() {
    super({
      message: "Password must be at least 6 characters long",
      error: "BAD_REQUEST",
      statusCode: 400,
    });
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: "Token has expired",
      error: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({
      message: "Invalid or malformed token",
      error: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
}

export class MissingTokenException extends UnauthorizedException {
  constructor() {
    super({
      message: "Authentication token is missing",
      error: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
}
