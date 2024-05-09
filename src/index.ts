import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import { v2 as cloudinary } from 'cloudinary';
import restaurantRoute from './routes/restaurantRoute';

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log('connected to MongoDB'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health status OK!' });
});

app.use('/api/user', userRoute);
app.use('/api/restaurant', restaurantRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
