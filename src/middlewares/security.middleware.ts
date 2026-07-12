import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import compression from 'compression';
import { Application } from 'express';

export const setupSecurityMiddlewares = (app: Application) => {
  // Set security HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors());
  app.options('*', cors());

  // Sanitize data against NoSQL query injection
  app.use(mongoSanitize());

  // Sanitize data against XSS
  app.use(xss());

  // Compress responses
  app.use(compression());
};
