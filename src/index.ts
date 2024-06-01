import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import userRoute from './routes/userRoute';
import restaurantRoute from './routes/restaurantRoute';
import myRestaurantRoute from './routes/myRestaurantRoute';
import orderRoute from './routes/orderRoute';
import { MDBConnect } from './mongoDB/connectMongoDB';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = 5000;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));
app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health status OK!' });
});

app.use('/api/user', userRoute);
app.use('/api/my/restaurant', myRestaurantRoute);
app.use('/api/restaurant', restaurantRoute);
app.use('/api/order', orderRoute);

MDBConnect();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
