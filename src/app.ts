import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middlewares.ts';
import healthCheckRouter from './routes/health-check.routes.ts';
import authRouter from './routes/auth.routes.ts';

const app: Express = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/health-check', healthCheckRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

export { app };
