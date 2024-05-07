import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log('connected to MongoDB'));

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health status OK!' });
});

app.use('/api/user', userRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
