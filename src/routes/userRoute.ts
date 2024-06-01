import express from 'express';
import {
  getUser,
  login,
  logout,
  signUp,
  updateUserProfile,
} from '../controllers/UserController';
import { jwtCheck } from '../middleware/auth';
import {
  validateLogin,
  validateSignupRequest,
  validateUserRequest,
} from '../middleware/validation';
import limiter from '../middleware/loginLimiter';

const router = express.Router();
router.get('/auth', jwtCheck, (req, res) =>
  res.json({ message: 'authorized' })
);
router.post('/sign-up', validateSignupRequest, signUp);
router.post('/login', validateLogin, limiter, login);
router.put('/', jwtCheck, validateUserRequest, updateUserProfile);
router.get('/', jwtCheck, getUser);
router.post('/logout', jwtCheck, logout);

export default router;
