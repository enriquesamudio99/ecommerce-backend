import express from 'express';
import dbConnection from './database/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();

// Import Routes 
import { authRoutes, productsRoutes } from './routes/index.js';

// Connect to DB
dbConnection(); 

// Configure app
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);

// Configure port and run the server 
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 