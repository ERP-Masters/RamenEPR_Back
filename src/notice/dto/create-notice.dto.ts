import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt } from "class-validator";

export class CreateNoticeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  author_id: number;

  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean;
}
