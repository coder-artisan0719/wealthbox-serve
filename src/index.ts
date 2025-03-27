import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import organizationRoutes from './routes/organization.routes';
import integrationRoutes from './routes/integration.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/integrations', integrationRoutes);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});