export class CreateUserDto {
  userName: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}
