import express from 'express';
import multer from 'multer';
import {
  createRestaurant,
  getMyRestaurantOrders,
  getRestaurant,
  updateOrderStatus,
  updateRestaurant,
} from '../controllers/MyRestaurantController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateRestaurantRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fieldSize: 5 * 1024 * 1024 } });

router.get('/order', jwtCheck, jwtParse, getMyRestaurantOrders);
router.post(
  '/',
  upload.single('imageFile'),
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  createRestaurant
);
router.get('/', jwtCheck, jwtParse, getRestaurant);
router.put(
  '/',
  upload.single('imageFile'),
  validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateRestaurant
);
router.patch('/order/:orderId/status', jwtCheck, jwtParse, updateOrderStatus);

export default router;
