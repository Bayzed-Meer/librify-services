import express from 'express';
import { JwtPayload } from '../../interfaces/jwt.interfaces.ts';

declare global {
  namespace Express {
    interface Request {
      user: record<string, JwtPayload>;
    }
  }
}
