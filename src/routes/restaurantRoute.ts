import express from 'express';
import { param } from 'express-validator';
import {
  getRestaurantDetails,
  searchRestaurant,
} from '../controllers/RestaurantController';

const router = express.Router();

router.get(
  '/search/:city',
  param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City param must be a valid string'),
  searchRestaurant
);

router.get(
  '/detail/:restaurantId',
  param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('restaurantId param must be a valid string'),
  getRestaurantDetails
);

export default router;
