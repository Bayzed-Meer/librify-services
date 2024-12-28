export interface JwtPayload {
  _id: string;
  email: string;
  role: 'member' | 'librarian' | 'admin';
}
