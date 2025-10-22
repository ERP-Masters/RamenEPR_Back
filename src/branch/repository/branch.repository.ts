import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { BranchEntity } from "../entities/branch.entity";
import { CreateBranchDto } from "../dto/create-branch.dto";
import { UpdateBranchDto } from "../dto/update-branch.dto";
import { UseState } from "@prisma/client";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly REGION_CODE_MAP: Record<string, string> = {
    서울: "SEOUL",
    부산: "BUSAN",
    대구: "DAEGU",
    인천: "INCHEON",
    광주: "GWANGJU",
    대전: "DAEJEON",
    울산: "ULSAN",
    세종: "SEJONG",
    경기: "GYEONGGI",
    강원: "GANGWON",
    충북: "CHUNGBUK",
    충남: "CHUNGNAM",
    전북: "JEONBUK",
    전남: "JEONNAM",
    경북: "GYEONGBUK",
    경남: "GYEONGNAM",
    제주: "JEJU",
  };

  private loadEntity(branch: any): BranchEntity {
    return new BranchEntity(
      branch.id,
      branch.branch_id,
      branch.name,
      branch.location,
      branch.detail_address,
      branch.store_owner,
      branch.contact,
      branch.isused,
      branch.created_at,
    );
  }

  /** 지역명에서 ERP용 branch_id 생성 (BR_SEOUL_001 형태) */
  private async generateBranchId(location: string): Promise<string> {
    let regionCode = "ETC";

    for (const key of Object.keys(this.REGION_CODE_MAP)) {
      if (location.includes(key)) {
        regionCode = this.REGION_CODE_MAP[key];
        break;
      }
    }

    // 같은 지역 내에서 몇 번째 지점인지 계산
    const count = await this.prisma.branch.count({
      where: { branch_id: { startsWith: `BR_${regionCode}_` } },
    });

    return `BR_${regionCode}_${(count + 1).toString().padStart(4, "0")}`;
  }

  /** 지점 생성 */
  async create(data: CreateBranchDto): Promise<BranchEntity> {
    const branch_id = await this.generateBranchId(data.location);

    const branch = await this.prisma.branch.create({
      data: {
        ...data,
        branch_id,
      },
    });

    return this.loadEntity(branch);
  }

  /** 전체 조회 */
  async findAll(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { isused: UseState.USED },
    });

    if (!branches.length) {
      throw new NotFoundException("현재 등록된 지점이 없습니다.");
    }

    return branches.map((b) => this.loadEntity(b));
  }

  /** 미사용 지점만 조회 */
  async notUsedBranch(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { isused: UseState.NOTUSED },
    });

    if (!branches.length) {
      throw new NotFoundException("현재 사용되지 않는 지점이 없습니다.");
    }

    return branches.map((b) => this.loadEntity(b));
  }

  /** ERP용 branch_id로 조회 */
  async findById(branchId: string): Promise<BranchEntity> {
    const branch = await this.prisma.branch.findUnique({
      where: { branch_id: branchId },
    });

    if (!branch) {
      throw new NotFoundException(`지점 ${branchId}을 찾을 수 없습니다.`);
    }

    return this.loadEntity(branch);
  }

  /** 이름으로 조회 */
  async findByBName(name: string): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { name },
    });

    if (!branches.length) {
      throw new NotFoundException(`지점 이름 ${name}을 찾을 수 없습니다.`);
    }

    return branches.map((b) => this.loadEntity(b));
  }

  /** 위치나 상세주소로 조회 */
  async findByLocationOrDetail(loc: string): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: {
        OR: [
          { location: { contains: loc } },
          { detail_address: { contains: loc } },
        ],
      },
    });

    if (!branches.length) {
      throw new NotFoundException(`지점 위치 ${loc}을 찾을 수 없습니다.`);
    }

    return branches.map((b) => this.loadEntity(b));
  }

  /** 수정 (id → branch_id 기반으로 변경) */
  async update(branchId: number, data: UpdateBranchDto): Promise<BranchEntity> {
    const branch = await this.prisma.branch.update({
      where: { id: branchId },
      data,
    });

    return this.loadEntity(branch);
  }

  /** 상태 변경 (USE / NOTUSE) */
  async changeUseState(
    branchId: number,
    state: UseState,
  ): Promise<BranchEntity> {
    const branch = await this.prisma.branch.update({
      where: { id: branchId },
      data: { isused: state },
    });

    return this.loadEntity(branch);
  }
}
