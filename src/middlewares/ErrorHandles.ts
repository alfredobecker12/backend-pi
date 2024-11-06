import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Errors/appError';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statuscode: err.statusCode,
      errormessage: err.message
    });
  
  } else {
    res.status(500).json({
      errormessage: 'Internal Server Error'
    });
  }
}

export { errorHandler };
