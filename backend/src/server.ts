import 'dotenv/config';
import dns from 'dns';
import http from 'http';
import app from './app.js';
import { connectToDatabase, closeDatabaseConnection } from './config/database.js';

// ── DNS FIX ──────────────────────────────────────────────────────────────────
// Node.js on Windows defaults to 127.0.0.1 as its DNS resolver even when
// nothing is actually listening on loopback port 53. This causes an immediate
// ECONNREFUSED when the MongoDB driver tries to resolve the mongodb+srv://
// SRV record. Override to real DNS servers before any network activity.
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '172.16.1.1']);
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Attempt connecting to MongoDB Atlas
    console.log('[Server] Connecting to MongoDB Atlas...');
    try {
      await connectToDatabase();
    } catch (dbErr) {
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.warn('[Server] MongoDB connection failed at startup:', errMsg);
      console.warn('[Server] The HTTP server will start; verify credentials in backend/.env.');
    }

    // Start HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`[Server] LAMS Backend API running on port ${PORT}`);
      console.log(`[Server] Health check:  http://localhost:${PORT}/api/health`);
      console.log(`[Server] Parcels API:   http://localhost:${PORT}/api/parcels`);
      console.log(`[Server] Projects API:  http://localhost:${PORT}/api/projects`);
      console.log(`[Server] Hissa API:     http://localhost:${PORT}/api/hissa`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await closeDatabaseConnection();
        console.log('[Server] Process terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Server] Fatal initialization error:', errorMessage);
    process.exit(1);
  }
}

startServer();
