import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token is provided in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'dev_porto_secret_jwt_token_key_13579';
      const decoded = jwt.verify(token, secret);

      // Fetch user from DB and attach to the request object (excluding password)
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'The user belonging to this token no longer exists',
        });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      
      let errorMessage = 'Not authorized to access this route';
      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Your session has expired. Please log in again';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Malformed token session. Please log in again';
      }

      return res.status(401).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Please log in to access this resource',
    });
  }
};
