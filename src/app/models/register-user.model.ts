export interface RegisterUserRequest {
  nombre: string;
  email: string;
  password: string;
  rolId?: number;
}