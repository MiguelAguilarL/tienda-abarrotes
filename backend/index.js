import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler } from './src/middlewares/errorHandler.js';
import tiendaRoutes from './src/routes/tiendaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());

app.use('/api', tiendaRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
