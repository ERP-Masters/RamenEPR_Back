import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRepository } from "./repository/login.repository";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: LoginRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 유저 검증
  async validateUser(userId: string, userPw: string) {
    const user = await this.repo.findByUserId(userId);
    if (!user) return null;

    // 비밀번호 해싱 비교
    const isMatch = await bcrypt.compare(userPw, user.userPw);
    if (!isMatch) return null;

    return {
      id: user.id,
      userId: user.userId,
      role: user.role,
    };
  }

  // 로그인
  async login(dto: LoginDto) {
    const validated = await this.validateUser(dto.userId, dto.userPw);

    if (!validated) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    const payload = {
      sub: validated.id,
      userId: validated.userId,
      role: validated.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: validated,
    };
  }
}
