export {};

declare global {
  var signin: () => string[];

  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
