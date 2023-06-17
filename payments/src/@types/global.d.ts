export {};

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  var signin: (id?: string) => string[];
  namespace NodeJS {
    interface ProcessEnv {
      NATS_URL: string;
      NATS_CLIET_ID: string;
      NATS_CLUSTER_ID: string;
      MONGO_URI: string;
      JWT_KEY: string;
      STRIPE_KEY: string;
    }
  }

  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}
