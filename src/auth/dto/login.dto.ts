import { IsString } from "class-validator";

export class LoginDto {
  @IsString()
  userId: string;

  @IsString()
  userPw: string;
}
