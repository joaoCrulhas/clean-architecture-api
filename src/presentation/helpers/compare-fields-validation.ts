import { InvalidParamError } from '../errors/invalid-param.error';
import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';
class CompareFieldsValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(args: string[]): ValidationResponse {
    const isEqual = args.every((v: string) => v === args[0]);
    if (!isEqual) {
      return {
        error: new InvalidParamError(this.fieldName)
      };
    }
    return {
      error: null
    };
  }
}
export { CompareFieldsValidation };
