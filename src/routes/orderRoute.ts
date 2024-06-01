import express from 'express';
import { jwtCheck } from '../middleware/auth';
import {
  createCheckoutSession,
  getMyOrders,
  stripeWebhookHandler,
} from '../controllers/OrderController';

const router = express.Router();

router.get('/', jwtCheck, getMyOrders);
router.post(
  '/checkout/create-checkout-session',
  jwtCheck,
  createCheckoutSession
);
router.post('/checkout/webhook', stripeWebhookHandler);

export default router;
