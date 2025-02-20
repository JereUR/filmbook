export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class AuthorizationError extends Error {
  constructor(message = "No autorizado") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
  }
}

