import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import parcelRoutes from './routes/parcelRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import hissaRoutes from './routes/hissaRoutes.js';
import districtMonitoringRoutes from './routes/districtMonitoringRoutes.js';

const app = express();

// CORS configuration - allow local Vite frontend development origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or any localhost port
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Standard JSON request body parsing
app.use(express.json());

// Mount API routes under /api
app.use('/api', parcelRoutes);
app.use('/api', projectRoutes);
app.use('/api', hissaRoutes);
app.use('/api/district-monitoring', districtMonitoringRoutes);
app.use('/api/district', districtMonitoringRoutes);

// Root informational endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Land Acquisition Management System (LAMS) API',
    version: '1.0.0',
    description: 'SIH 2026 Problem Statement 26016 - Cadastral GIS & Acquisition Backend',
    endpoints: {
      health: '/api/health',
      parcels: '/api/parcels',
      parcelById: '/api/parcels/:id',
      projects: '/api/projects',
      projectById: '/api/projects/:id',
      hissa: '/api/hissa',
      hissaByParcel: '/api/hissa/parcel/:parcelId',
      districtMonitoringProjects: '/api/district-monitoring/projects',
      districtMonitoringStats: '/api/district-monitoring/stats',
      districtMonitoringActivity: '/api/district-monitoring/activity',
    },
  });
});

// 404 Route Not Found Handler (JSON response)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found. Please check the requested API path.',
  });
});

// Centralized JSON Error Handler Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err.message);

  // Clean error message to avoid leaking database credentials
  const cleanMessage = err.message
    ? err.message.replace(/mongodb\+srv:\/\/[^@]+@/g, 'mongodb+srv://[REDACTED]@')
    : 'An unexpected internal server error occurred.';

  res.status(500).json({
    error: cleanMessage,
  });
});

export default app;
