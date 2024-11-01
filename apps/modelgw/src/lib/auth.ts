import jwt from 'jsonwebtoken';


export type User = {
  id: string,
  name: string,
  lastName: string,
  email: string,
}

export function getUser(token: string): User | null {
  try {
    if (token) {
      const res = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
      if (res) {
        return { id: 'ADMIN', email: res.email, name: 'ADMIN', lastName: 'ADMIN' };
      }
    }
    return null;
  } catch (err) {
    return null;
  }
};
