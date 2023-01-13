import { InvalidParamError } from '../errors/invalid-param.error';
import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';
class CompareFieldsValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  /**
   * Returns true if all values provide in the array are the same
   * @param args - array of string if values to compare
   * @returns true if all values are the same, error if one of element in array has different value
   */
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
