import app from './app';
import { config } from './config';
import { prisma } from './config/prisma';
import { connectDB } from './config/db';

const PORT = config.port;

const startServer = async () => {
  // Connect to database (MongoDB Mongoose or SQLite Prisma)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Event Management REST API server running on port ${PORT}`);
    console.log(`📖 Swagger API Docs: http://localhost:3000/api-docs`);
    console.log(`📥 Postman Collection: http://localhost:3000/api/v1/postman-collection`);
    console.log(`=======================================================`);
  });

  const shutdown = async () => {
    console.log('Shutting down server gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Database connection closed. Process exited.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
