export interface Validation {
  validate(args: any): Error | null;
}
