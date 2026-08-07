import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes';
import eventRoutes from './routes/eventRoutes';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';

const app = express();

app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(cors({ origin: '*', credentials: true }));

// Body Parsing & Static Files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes (Mounted on /api/v1, /v1, and / for serverless rewrite compatibility)
app.use('/api/v1', apiRouter);
app.use('/v1', apiRouter);
app.use('/events', eventRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
