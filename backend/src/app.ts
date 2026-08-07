import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import apiRouter from './routes';
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

// Dynamic Lazy Load Swagger Docs to prevent serverless bundling failure
app.get('/api-docs*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const swaggerUi = require('swagger-ui-express');
    const { swaggerSpec } = require('./config/swagger');
    return swaggerUi.serve[0](req, res, () => {
      swaggerUi.setup(swaggerSpec)(req, res, next);
    });
  } catch (e) {
    res.status(200).json({ message: 'Swagger API Docs available in local environment' });
  }
});

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 Route Handler for unmatched API routes
app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
