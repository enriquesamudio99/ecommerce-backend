import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

// Import Routes 
import { authRoutes, productsRoutes, blogsRoutes, categoriesRoutes } from './routes/index.js';

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
app.use('/api/v1/blogs', blogsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

export default app;