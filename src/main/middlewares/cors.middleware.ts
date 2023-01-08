import { NextFunction, Request, Response } from 'express';

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set('access-control-allow-origin', '*');
  next();
};

export { cors };
