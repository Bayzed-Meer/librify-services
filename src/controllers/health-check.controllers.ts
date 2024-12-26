import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.ts';

export const getHealthStatus = asyncHandler(
  async (_req: Request, res: Response) => {
    const status = mongoose.connection.readyState;

    const response = {
      status: status === 1 ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  },
);
