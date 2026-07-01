import { ZodError } from 'zod';
import ApiResponse from '../utils/ApiResponse.js';

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(new ApiResponse(400, null, 'Validation failed'));
      }

      return res.status(500).json(new ApiResponse(500, null, 'Internal server error'));
    }
  };
};

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err?.statusCode || err?.status || 500;
  const message = err?.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
};

export default validate;