import express from 'express';
import dbConnection from './database/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

// Import Routes 
import { authRoutes } from './routes/index.js';

// Connect to DB
dbConnection(); 

// Configure app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoutes);

// Configure port and run the server
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});