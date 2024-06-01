import express from 'express';
import multer from 'multer';
import {
  createRestaurant,
  getMyRestaurantOrders,
  getRestaurant,
  updateOrderStatus,
  updateRestaurant,
} from '../controllers/MyRestaurantController';
import { jwtCheck } from '../middleware/auth';
import { validateRestaurantRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fieldSize: 5 * 1024 * 1024 } });

router.get('/order', jwtCheck, getMyRestaurantOrders);
router.post(
  '/',
  upload.single('imageFile'),
  validateRestaurantRequest,
  jwtCheck,
  createRestaurant
);
router.get('/', jwtCheck, getRestaurant);
router.put(
  '/',
  upload.single('imageFile'),
  validateRestaurantRequest,
  jwtCheck,
  updateRestaurant
);
router.put('/order/:orderId/status', jwtCheck, updateOrderStatus);

export default router;
