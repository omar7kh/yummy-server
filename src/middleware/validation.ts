import { NextFunction, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationError = (
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

export const validateUserRequest = [
  body('name').isString().notEmpty().withMessage('Name must be a string'),
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
  handleValidationError,
];
