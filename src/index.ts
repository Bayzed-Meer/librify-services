import 'dotenv/config';
import { app } from './app.ts';
import { connectDB } from './config/db.ts';

const PORT = process.env.PORT ?? 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error);
  });
