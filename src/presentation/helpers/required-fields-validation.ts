import { MissingParamError } from '../errors/missing-param.error';
import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';

class RequiredFieldsValidation implements Validation {
  constructor(private readonly fieldRequired: string) {}
  validate(args: any): ValidationResponse {
    let isValid = true;
    let missingParam = '';
    const hasProperty = Object.prototype.hasOwnProperty.call(
      args,
      this.fieldRequired
    );
    if (!hasProperty) {
      isValid = false;
      missingParam = this.fieldRequired;
    }
    if (!isValid) {
      return {
        error: new MissingParamError(missingParam)
      };
    }
    return { error: null };
  }
}
export { RequiredFieldsValidation };
