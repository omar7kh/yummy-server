import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many Login requests, please try again after 1 minute',
});

export default limiter;
