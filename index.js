import express from 'express';
import cors from 'cors';
import { connectDB } from './src/database/connect.js';
import pfRoutes from './src/routes/pfRoutes.js';
import pjRoutes from './src/routes/pjRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao MongoDB
connectDB();

// Rotas
app.use('/pf', pfRoutes);
app.use('/pj', pjRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
