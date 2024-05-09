import express from 'express';
import {
  createUser,
  getCurrentUser,
  updateUserProfile,
} from '../controllers/userController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateUserRequest } from '../middleware/validation';

const router = express.Router();

router.get('/', jwtCheck, jwtParse, getCurrentUser);
router.post('/', jwtCheck, createUser);
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUserProfile);

export default router;
