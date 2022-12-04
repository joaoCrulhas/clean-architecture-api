export interface HttpRequest<BD = unknown> {
  body?: BD;
}

export interface BodySignupRequest {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}
