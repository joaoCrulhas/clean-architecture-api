import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';

class ValidationComposite implements Validation {
  constructor(private readonly validations: Array<Validation>) {}
  validate(args: any): ValidationResponse {
    for (const validator of this.validations) {
      const { error } = validator.validate(args);
      if (error) {
        return {
          error
        };
      }
    }
    return {
      error: null
    };
  }
  getValidatos(): Array<Validation> {
    return this.validations;
  }
}
export { ValidationComposite };
