import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { WarehouseEntity } from "../entities/warehouse.entity";
import { UseState } from "@prisma/client";

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) { }

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


  private loadEntity(warehouse: any): WarehouseEntity {
    return new WarehouseEntity(
      warehouse.id,
      warehouse.warehouse_id,
      warehouse.name,
      warehouse.location,
      warehouse.isused,
      warehouse.created_at,
    );
  }

  private async generateWhId(location: string): Promise<string> {
    let regionCode = "ETC";

    for (const key of Object.keys(this.REGION_CODE_MAP)) {
      if (location.includes(key)) {
        regionCode = this.REGION_CODE_MAP[key];
        break;
      }
    }

    // 같은 지역 내에서 몇 번째 지점인지 계산
    const count = await this.prisma.branch.count({
      where: { branch_id: { startsWith: `WH_${regionCode}_` } },
    });

    return `WH_${regionCode}_${(count + 1).toString().padStart(4, "0")}`;
  }

  // 창고 등록
  async create(data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouse_id = await this.generateWhId(data.location);

    const warehouses = await this.prisma.warehouse.create({ 
      data: {
        ...data,
        warehouse_id,
      }
     });

    return this.loadEntity(warehouses);
  }

  //전체 창고 조회
  async findAll(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isused: UseState.USED },
    });

    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }

  async findNotUsedWh(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isused: UseState.NOTUSED },
    });

    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }
  //위치로 검색
  async findByLocation(loc: string): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: {
        location: {
          contains: loc,
        },
      },
    });

    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }

  //창고 ID로 검색 (Null-safe)
  async findByWarehouseId(id: string): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: {
        warehouse_id: id,
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.loadEntity(warehouse);
  }

  //창고 수정
  async update(id: number, data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouses = await this.prisma.warehouse.update({
      where: { id: id },
      data,
    });

    return this.loadEntity(warehouses);
  }

  // 창고 수정
  async changeUseState(id: number, state: UseState): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.update({
      where: { id: id },
      data: { isused: state }
    });

    return this.loadEntity(warehouse);
  }

}
