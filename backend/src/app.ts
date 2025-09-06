import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { config } from '@/config';
import Database from '@/config/database';
import { logger } from '@/utils';
import { errorHandler, notFound } from '@/middleware';
import routes from '@/routes';

class App {
  public app: express.Application;
  public server: any;
  public io: Server;
  private database: Database;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.database = Database.getInstance();
    this.io = new Server(this.server, {
      cors: {
        origin: config.FRONTEND_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: config.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000, // minutes to milliseconds
      max: config.RATE_LIMIT_MAX_REQUESTS,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Trust proxy for rate limiting and correct IP detection
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Mount API routes
    this.app.use('/api', routes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'SynergySphere API',
        version: '1.0.0',
        status: 'Running',
        documentation: '/api/health',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Join project rooms
      socket.on('join-project', (projectId: string) => {
        socket.join(`project-${projectId}`);
        logger.info(`Socket ${socket.id} joined project-${projectId}`);
      });

      // Leave project rooms
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project-${projectId}`);
        logger.info(`Socket ${socket.id} left project-${projectId}`);
      });

      // Handle task updates
      socket.on('task-updated', (data: any) => {
        socket.to(`project-${data.projectId}`).emit('task-updated', data);
      });

      // Handle project updates
      socket.on('project-updated', (data: any) => {
        socket.to(`project-${data.projectId}`).emit('project-updated', data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.database.connect();
      logger.info('Database connected successfully');

      // Start server
      this.server.listen(config.PORT, () => {
        logger.info(`🚀 Server is running on port ${config.PORT}`);
        logger.info(`📱 Environment: ${config.NODE_ENV}`);
        logger.info(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.database.disconnect();
      this.server.close();
      logger.info('Server stopped gracefully');
    } catch (error) {
      logger.error('Error stopping server:', error);
    }
  }
}

export default App;
