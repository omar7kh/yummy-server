import { NextFunction, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateSignupRequest = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First Name is required')
    .if(body('firstName').notEmpty())
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Your Name must contain only letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('Your Name must be at least 2 characters long')
    .escape(),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last Name is required')
    .if(body('lastName').notEmpty())
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Your Name must contain only letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('Your Name must be at least 2 characters long')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-Mail address is required')
    .if(body('email').notEmpty())
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .if(body('password').notEmpty())
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .isLength({ min: 8, max: 40 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .if(body('email').notEmpty())
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail(),

  body('password').trim().notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateUserRequest = [
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('First Name must be a string'),
  body('lastName').isString().notEmpty().withMessage('Last Name be a string'),
  body('address.city')
    .isString()
    .notEmpty()
    .withMessage('City must be a string'),
  body('address.country')
    .isString()
    .notEmpty()
    .withMessage('Country must be a string'),
  body('address.street')
    .isString()
    .notEmpty()
    .withMessage('Street must be a string'),
  handleValidationErrors,
];

export const validateRestaurantRequest = [
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('deliveryPrice')
    .isFloat({ min: 0 })
    .withMessage('Delivery price must be a positive number'),
  body('estimatedDeliveryTime')
    .isInt({ min: 0 })
    .withMessage('Estimated delivery time must be a positive integer'),
  body('cuisines')
    .isArray()
    .withMessage('Cuisines must be an array')
    .not()
    .isEmpty()
    .withMessage('Cuisines array cannot be empty'),
  body('menuItems').isArray().withMessage('Menu items must be an array'),
  body('menuItems.*.name').notEmpty().withMessage('Menu item name is required'),
  body('menuItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Menu item price is required and must be a positive number'),
  handleValidationErrors,
];
