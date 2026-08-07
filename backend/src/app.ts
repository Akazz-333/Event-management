import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import apiRouter from './routes';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';

const app = express();

// Security Middlewares with custom CSP for inline attributes support
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      statusCode: 429,
    },
  },
});
app.use('/api/', limiter);

// Body Parsing & Static Files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Interactive Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 Route Handler for unmatched routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
