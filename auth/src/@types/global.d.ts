export {};

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  var signin: () => Promise<string[]>;

  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}
