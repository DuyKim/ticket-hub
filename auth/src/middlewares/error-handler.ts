import { CustomError } from '../errors/custom-error';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
