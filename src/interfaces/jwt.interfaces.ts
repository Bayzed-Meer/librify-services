export interface JwtPayload {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
}
