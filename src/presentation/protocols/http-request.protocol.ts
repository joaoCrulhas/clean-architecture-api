export interface HttpRequest {
  body?: any;
}

export interface SignupRequest {
  body: {
    username: string;
    password: string;
    passwordConfirmation: string;
    email: string;
  };
}
