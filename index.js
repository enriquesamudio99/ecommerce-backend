import app from './src/app.js';
import dbConnection from './src/config/db.js';
import * as dotenv from 'dotenv';
dotenv.config();

function main() {
  // Connect to DB
  dbConnection(); 
  // Configure port and run the server 
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }); 
}

main();