import { IsString, IsBoolean, IsOptional } from "class-validator";

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean;
}