import { Request, Response } from 'express';
import { Controller } from '../../presentation/controllers/controller.protocol';
import { HttpRequest } from '../../presentation/protocols';

const adapterController = (controller: Controller<any>) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    };
    const { statusCode, data } = await controller.exec(httpRequest);
    return res.status(statusCode).json(data);
  };
};

export { adapterController };
