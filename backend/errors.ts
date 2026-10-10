export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

// --- 4xx Client Errors ---

/**
 * 400 Bad Request
 * The server cannot or will not process the request due to something that is
 * perceived to be a client error (e.g., malformed request syntax, invalid
 * request message framing, or deceptive request routing).
 */
export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized
 * Although the HTTP standard specifies "unauthorized", semantically this
 * response means "unauthenticated". That is, the client must authenticate
 * itself to get the requested response.
 */
export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden
 * The client does not have access rights to the content; that is, it is
 * unauthorized, so the server is refusing to give the requested resource.
 * Unlike 401 Unauthorized, the client's identity is known to the server.
 */
export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found (Provided by you, included for completeness)
 * The server cannot find the requested resource. In the browser, this means
 * the URL is not recognized. In an API, this can also mean that the endpoint
 * is valid but the resource itself does not exist.
 */
export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict
 * This response is sent when a request conflicts with the current state of the
 * server. Often used for PUT requests that would create a resource that
 * already exists.
 */
export class ConflictError extends CustomError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

/**
 * 422 Unprocessable Entity (WebDAV; RFC 4918)
 * The request was well-formed but was unable to be followed due to
 * semantic errors. Often used for validation errors in API responses.
 */
export class UnprocessableEntityError extends CustomError {
  constructor(message: string = 'Unprocessable Entity') {
    super(message, 422);
  }
}

/**
 * 429 Too Many Requests (RFC 6585)
 * The user has sent too many requests in a given amount of time ("rate limiting").
 */
export class TooManyRequestsError extends CustomError {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
  }
}

// --- 5xx Server Errors ---

/**
 * 500 Internal Server Error (Provided by you, included for completeness)
 * The server has encountered a situation it doesn't know how to handle.
 */
export class InternalError extends CustomError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

/**
 * 503 Service Unavailable
 * The server is not ready to handle the request. Common causes are a server
 * that is down for maintenance or that is overloaded.
 */
export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service Unavailable') {
    super(message, 503);
  }
}

// Example Usage:
// function getUser(userId: string) {
//   if (!userId) {
//     throw new BadRequestError('User ID is required.');
//   }
//   const user = database.findUser(userId);
//   if (!user) {
//     throw new NotFoundError(`User with ID ${userId} not found.`);
//   }
//   // Assume some permission check
//   if (!user.canAccessResource) {
//       throw new ForbiddenError('You do not have permission to access this user profile.');
//   }
//   return user;
// }

// try {
//     // ... some code
// } catch (error) {
//     if (error instanceof CustomError) {
//         console.error(`HTTP Error ${error.statusCode}: ${error.message}`);
//         // Respond to client with error.statusCode and error.message
//     } else {
//         console.error('An unexpected error occurred:', error);
//         // Respond with a generic 500 error
//     }
// }
