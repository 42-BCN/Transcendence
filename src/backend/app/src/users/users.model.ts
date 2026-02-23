export type User = {
  id: string;
  email: string;
  createdAt: Date;
  username: string | null;
  passwordHash: string;
};
