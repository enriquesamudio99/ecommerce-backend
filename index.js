import express from 'express';
import dbConnection from './database/config.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

// Import Routes 

dbConnection(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes


const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});