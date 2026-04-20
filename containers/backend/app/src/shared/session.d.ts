import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    guestId?: string;
    guestUsername?: string;
  }
}
