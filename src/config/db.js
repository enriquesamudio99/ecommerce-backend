import mongoose from 'mongoose';

const dbConnection = async () => {
  try { 
    mongoose.connect(process.env.DB_CONNECTION);
    console.log('Database online'); 
  } catch (error) {
    console.log(error);
    throw new Error('Error initializing the database');
  }
}

export default dbConnection;