import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateBranchRequestDto, OrderItemDto } from "../dto/create-branch-request.dto";
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
            row.items,
            row.request_note,
            row.status,
            row.created_at,
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
    async create(dto: CreateBranchRequestDto): Promise<BranchRequestEntity> {
        const orderId = await this.generateBranchOrderId(dto.branch_id);

        const row = await this.prisma.orderRequest.create({
            data: {
                order_id: orderId,
                branch_id: dto.branch_id,
                request_note: dto.request_note,
                status: dto.status,
                desired_due_date: dto.desired_due_date,

                items: {
                    create: dto.items.map((i) => ({
                        item_id: i.item_id,
                        quantity: i.quantity,
                        unit_price: i.unit_price,
                        amount: i.amount,
                    })),
                },
            },
            include: { items: true },
        });

        return this.loadEntity(row);
    }

    /** 전체 조회 */
    async findAll(): Promise<BranchRequestEntity[]> {
        const rows = await this.prisma.orderRequest.findMany({
            include: { items: true },
            orderBy: { created_at: "desc" },
        });
        return rows.map((r) => this.loadEntity(r));
    }

    /** 기간별 조회 */
    async findByPeriod(s: Date, e: Date) {
        const rows = await this.prisma.orderRequest.findMany({
            where: { created_at: { gte: s, lte: e } },
            include: { items: true },
            orderBy: { created_at: "desc" },
        });

        return rows.map((r) => this.loadEntity(r));
    }

    /** 단일 조회 */
    async findById(id: number) {
        const row = await this.prisma.orderRequest.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!row) throw new NotFoundException("요청을 찾을 수 없음");
        return this.loadEntity(row);
    }

    /** 지점 ID 조회 */
    async findByBranch(branchId: number) {
        const rows = await this.prisma.orderRequest.findMany({
            where: { branch_id: branchId },
            include: { items: true },
            orderBy: { created_at: "desc" },
        });

        return rows.map((r) => this.loadEntity(r));
    }

    /** 지점 이름 조회 */
    async findByBranchName(name: string) {
        const branch = await this.prisma.branch.findFirst({ where: { name } });
        if (!branch) throw new NotFoundException("지점 없음");
        return this.findByBranch(branch.id);
    }

    /** 상태별 조회 */
    async findByStatus(status: OrderStatus) {
        const rows = await this.prisma.orderRequest.findMany({
            where: { status },
            include: { items: true },
            orderBy: { created_at: "desc" },
        });

        return rows.map((r) => this.loadEntity(r));
    }

    /** 수정 */
    async update(id: number, dto: UpdateBranchRequestDto) {
        const row = await this.prisma.orderRequest.update({
            where: { id },
            data: {
                request_note: dto.request_note,
                status: dto.status,
                desired_due_date: dto.desired_due_date,
            },
            include: { items: true },
        });

        return this.loadEntity(row);
    }

    /** 취소 */
    async cancel(id: number) {
        const row = await this.prisma.orderRequest.update({
            where: { id },
            data: { status: OrderStatus.CANCELED },
            include: { items: true },
        });
        return this.loadEntity(row);
    }
}