import { Controller } from './controller.protocol';

class SignupController implements Controller {
  exec(request: any): any {
    return {
      statusCode: 400
    };
  }
}

export { SignupController };
