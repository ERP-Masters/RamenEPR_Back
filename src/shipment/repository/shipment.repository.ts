// src/shipment/repository/shipment.repository.ts
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ShipmentEntity } from "../entities/shipment.entity";
import { CreateShipmentDto } from "../dto/create-shipment.dto";
import { DeliveryStatus, LotActionType, OrderStatus } from "@prisma/client";

@Injectable()
export class ShipmentRepository {
    constructor(private readonly prisma: PrismaService) { }

    private loadEntity(row: any): ShipmentEntity {
        return new ShipmentEntity(
            row.id,
            row.shipment_id,
            row.order_id,
            row.warehouse_id,
            row.branch_id,
            row.shipped_date,
            row.due_date,
            row.delivery_status,
        );
    }

    private async generateShipmentId(branchId: number): Promise<string> {
        const today = new Date();
        const yyMMdd = today.toISOString().slice(2, 10).replace(/-/g, "");
        const prefix = `SH_${branchId}_${yyMMdd}_`;

        const count = await this.prisma.shipment.count({
            where: { shipment_id: { startsWith: prefix } },
        });

        const seq = (count + 1).toString().padStart(3, "0");
        return `${prefix}${seq}`;
    }

    async createFromOrder(orderId: number, dto: CreateShipmentDto) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.orderRequest.findUnique({
                where: { id: orderId },
                include: { items: true },
            });

            if (!order) {
                throw new NotFoundException(`OrderRequest ID ${orderId}를 찾을 수 없습니다.`);
            }

            if (!order.items || order.items.length === 0) {
                throw new BadRequestException("해당 수주에는 품목이 없습니다.");
            }

            const warehouseId = dto.warehouse_id;
            const branchId = order.branch_id;

            const shipmentId = await this.generateShipmentId(branchId);

            const now = new Date();

            const shipmentRow = await tx.shipment.create({
                data: {
                    shipment_id: shipmentId,
                    order_id: order.id,
                    warehouse_id: warehouseId,
                    branch_id: branchId,
                    shipped_date: now,
                    due_date: order.desired_due_date,
                    delivery_status: DeliveryStatus.PENDING,
                },
            });

            const perItemResults: {
                item_id: number;
                requested: number;
                shipped: number;
                remaining: number;
            }[] = [];

            for (const item of order.items) {
                const itemId = item.item_id;
                let remaining = item.quantity;
                let shipped = 0;

                const inventories = await tx.inventory.findMany({
                    where: {
                        warehouse_id: warehouseId,
                        item_id: itemId,
                        quantity: { gt: 0 },
                    },
                    orderBy: { expiry_date: "asc" },
                });

                for (const inv of inventories) {
                    if (remaining <= 0) break;
                    if (inv.quantity <= 0) continue;

                    const movable = Math.min(remaining, inv.quantity);

                    await tx.inventory.update({
                        where: { id: inv.id },
                        data: { quantity: { decrement: movable } },
                    });

                    const outboundLotId = `${inv.lot_id}_OUT_${Date.now()}`;

                    await tx.lotTrace.create({
                        data: {
                            lot_id: outboundLotId,
                            item_id: inv.item_id,
                            warehouse_id: inv.warehouse_id,
                            inventory_id: inv.id,
                            manufacture_date: inv.store_date,
                            expiry_date: inv.expiry_date,
                            shipment_id: shipmentRow.id,
                            action_type: LotActionType.OUTBOUND,
                        },
                    });

                    remaining -= movable;
                    shipped += movable;
                }

                perItemResults.push({
                    item_id: itemId,
                    requested: item.quantity,
                    shipped,
                    remaining,
                });
            }

            const anyShipped = perItemResults.some((r) => r.shipped > 0);
            const anyRemaining = perItemResults.some((r) => r.remaining > 0);

            let newOrderStatus: OrderStatus = order.status;

            if (!anyShipped) {
                newOrderStatus = OrderStatus.PENDING;
            } else if (!anyRemaining) {
                newOrderStatus = OrderStatus.COMPLETED;
            } else {
                newOrderStatus = OrderStatus.PARTIALLY;
            }

            await tx.orderRequest.update({
                where: { id: order.id },
                data: { status: newOrderStatus },
            });

            const finalShipment = await tx.shipment.update({
                where: { id: shipmentRow.id },
                data: {
                    delivery_status: DeliveryStatus.PENDING,
                },
            });

            return {
                shipment: this.loadEntity(finalShipment),
                orderStatus: newOrderStatus,
                items: perItemResults,
            };
        });
    }

    async findAll(): Promise<ShipmentEntity[]> {
        const rows = await this.prisma.shipment.findMany({
            orderBy: { shipped_date: "desc" },
        });
        return rows.map((r) => this.loadEntity(r));
    }

    async findById(id: number): Promise<ShipmentEntity> {
        const row = await this.prisma.shipment.findUnique({ where: { id } });
        if (!row) {
            throw new NotFoundException(`Shipment ID ${id}를 찾을 수 없습니다.`);
        }
        return this.loadEntity(row);
    }
}