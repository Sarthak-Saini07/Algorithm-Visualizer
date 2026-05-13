import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import algorithmRoutes from './routes/algorithms.routes';
import visualizationRoutes from './routes/visualizations.routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/algorithms', algorithmRoutes);
app.use('/api/v1/visualizations', visualizationRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', data: {} });
});

// Error handling middleware
app.use(errorHandler);

export default app;
