import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import UserRoute from './routes/UserRoute';
import RestaurantRoute from './routes/RestaurantRoute';
import MyRestaurantRoute from './routes/MyRestaurantRoute';

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

app.use('/api/user', UserRoute);
app.use('/api/my/restaurant', MyRestaurantRoute);
app.use('/api/restaurant', RestaurantRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
