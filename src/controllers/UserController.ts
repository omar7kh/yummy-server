import { Request, Response } from 'express';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET as string;

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Email or Password are not correct' });
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password as string
    );

    if (!checkPassword) {
      return res
        .status(401)
        .json({ message: 'Email or Password are not correct' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('jwt_yummy', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json('something went wrong');
  }
};

// SIGNUP
export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword, address } =
    req.body;

  console.log('req.body', req.body);

  try {
    const existingUser = await UserModel.findOne({ email });
    console.log('existingUser', existingUser);

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (password !== confirmPassword) {
      return res.status(409).json({ message: 'Passwords must match ' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.address = address;
    newUser.createdAt = new Date();

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json('something went wrong');
  }
};

// UPDATE USER
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, address } = req.body;
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;

    if (address) {
      user.address = { ...user.address, ...address };
    }

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  res.cookie('jwt_yummy', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: 'logged out' });
};

// GET USER
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting user' });
  }
};
