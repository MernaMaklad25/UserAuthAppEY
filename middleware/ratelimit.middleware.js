import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_INTERVAL_IN_MS,
  limit: process.env.REQUESTS_RATE_LIMIT,
  message: "Too many request, please try again later", 
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter