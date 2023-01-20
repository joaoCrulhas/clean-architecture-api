export interface ValidationResponse {
  error: Error | null;
}
export interface Validation {
  validate(args: any): ValidationResponse;
}
