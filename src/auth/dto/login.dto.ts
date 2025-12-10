import { IsString, IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class LoginDto {
  @IsString()
  userId: string;

  @IsString()
  userPw: string;

  @IsEnum(Role)
  role: Role;
}
