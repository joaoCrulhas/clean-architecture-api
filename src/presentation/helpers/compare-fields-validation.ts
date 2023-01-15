import { InvalidParamError } from '../errors/invalid-param.error';
import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';
class CompareFieldsValidation implements Validation {
  constructor(
    private readonly firstField: string,
    private readonly secondField: string
  ) {}
  /**
   * Returns true if all values provide in the array are the same
   * @param args - array of string if values to compare
   * @returns true if all values are the same, error if one of element in array has different value
   */
  validate(args: any): ValidationResponse {
    const firstValue = args[this.firstField];
    const secondValue = args[this.secondField];
    if (firstValue !== secondValue) {
      return {
        error: new InvalidParamError(this.secondField)
      };
    }
    return {
      error: null
    };
  }
}
export { CompareFieldsValidation };
