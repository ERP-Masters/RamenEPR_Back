import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateBranchRequestDto } from "../dto/create-branch-request.dto";
import { UpdateBranchRequestDto } from "../dto/update-branch-request.dto"; 
import { BranchRequestEntity } from "../entities/branch-request.entity";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class BranchRequestRepository {
    constructor(private readonly prisma: PrismaService) { }

    private loadEntity(row: any): BranchRequestEntity {
        return new BranchRequestEntity(
            row.id,
            row.order_id,
            row.branch_id,
            row.item_id,
            row.quantity,
            row.unit_price,
            row.amount,
            row.request_note,
            row.status,
            row.desired_due_date,
        );
    }

    /** order_id 생성: BR_{branchId}_{YYMMDD}_{SEQ} */
    private async generateBranchOrderId(branchId: number): Promise<string> {
        const today = new Date();
        const yyMMdd = today.toISOString().slice(2, 10).replace(/-/g, "");
        const prefix = `BR_${branchId}_${yyMMdd}_`;

        const count = await this.prisma.orderRequest.count({
            where: {
                order_id: { startsWith: prefix },
            },
        });

        const seq = (count + 1).toString().padStart(3, "0");
        return `${prefix}${seq}`;
    }

    /** 생성 */
    async create(data: CreateBranchRequestDto): Promise<BranchRequestEntity> {
        const order_id = await this.generateBranchOrderId(data.branch_id);

        const row = await this.prisma.orderRequest.create({
            data: {
                order_id,
                branch_id: data.branch_id,
                item_id: data.item_id,
                quantity: data.quantity,
                unit_price: data.unit_price,
                amount: data.amount,
                request_note: data.request_note,
                status: data.status,
                desired_due_date: data.desired_due_date,
            },
        });

        return this.loadEntity(row);
    }

    /** 전체 조회 */
    async findAll(): Promise<BranchRequestEntity[]> {
        const rows = await this.prisma.orderRequest.findMany({
            orderBy: { created_at: "desc" },
        });
        return rows.map((r) => this.loadEntity(r));
    }

    /** 기간별 조회 */
    async findByPeriod(start: Date, end: Date): Promise<BranchRequestEntity[]> {
        const rows = await this.prisma.orderRequest.findMany({
            where: {
                created_at: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: { created_at: "desc" },
        });

        return rows.map((r) => this.loadEntity(r));
    }

    /** 단일 조회 */
    async findById(id: number): Promise<BranchRequestEntity> {
        const row = await this.prisma.orderRequest.findUnique({ where: { id } });
        if (!row) throw new NotFoundException(`ID ${id}의 요청을 찾을 수 없습니다.`);
        return this.loadEntity(row);
    }

    /** 지점 ID 조회 */
    async findByBranch(branchId: number): Promise<BranchRequestEntity[]> {
        const rows = await this.prisma.orderRequest.findMany({
            where: { branch_id: branchId },
            orderBy: { created_at: "desc" },
        });

        return rows.map((r) => this.loadEntity(r));
    }

    /** 지점 이름 조회 */
    async findByBranchName(name: string): Promise<BranchRequestEntity[]> {
        const branch = await this.prisma.branch.findFirst({
            where: { name },
        });
        if (!branch) throw new NotFoundException(`지점 '${name}'을 찾을 수 없습니다.`);

        return this.findByBranch(branch.id);
    }

    /** 상태별 조회 */
    async findByStatus(status: OrderStatus): Promise<BranchRequestEntity[]> {
        const rows = await this.prisma.orderRequest.findMany({
            where: { status },
            orderBy: { created_at: "desc" },
        });
        return rows.map((r) => this.loadEntity(r));
    }

    /** 수정 */
    async update(id: number, data: UpdateBranchRequestDto): Promise<BranchRequestEntity> {
        const row = await this.prisma.orderRequest.update({
            where: { id },
            data,
        });
        return this.loadEntity(row);
    }

    /** 취소 */
    async cancel(id: number): Promise<BranchRequestEntity> {
        const row = await this.prisma.orderRequest.update({
            where: { id },
            data: { status: OrderStatus.CANCELED },
        });
        return this.loadEntity(row);
    }
}