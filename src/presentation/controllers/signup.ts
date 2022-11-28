import { Controller } from './controller.protocol';

class SignupController implements Controller {
  exec(request: any): any {
    return {
      body: new Error('Missing the param username'),
      statusCode: 400
    };
  }
}

export { SignupController };
