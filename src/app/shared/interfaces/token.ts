export interface Token {
    email: string;
    type:string;
    userId:string;
    ip: string;
    iss: string;
    iat: number;
    exp: number;
  }
  
  export interface LoginResponse {
    accessToken: string;
  }