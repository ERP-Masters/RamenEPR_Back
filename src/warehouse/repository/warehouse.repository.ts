import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { WarehouseEntity } from "../entities/warehouse.entity";

@Injectable()
export class WarehouseRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateWarehouseDto): Promise<WarehouseEntity> {
        const warehouses = await this.prisma.warehouse.create({ data });
        return new WarehouseEntity(
            warehouses.warehouse_id,
            warehouses.name,
            warehouses.location,
            warehouses.created_at
        );
    }

    async findAll(): Promise<WarehouseEntity[]> {
        const warehouses = await this.prisma.warehouse.findMany();
        return warehouses.map(
            w => new WarehouseEntity(
                w.warehouse_id,
                w.name,
                w.location,
                w.created_at
            )
        );
    }

    async findBylocation(loc: string): Promise<WarehouseEntity[]> {
        const warehouses = await this.prisma.warehouse.findMany({
            where: {
                location: loc,
            }
        });
        return warehouses.map(
            w => new WarehouseEntity(
                w.warehouse_id,
                w.name,
                w.location,
                w.created_at
            )
        );
    }

    async findByWarehouseId(id: number): Promise<WarehouseEntity> {
        const warehouses = await this.prisma.warehouse.findUnique({
            where: {
                warehouse_id: id,
            }
        });
        return new WarehouseEntity(
            warehouses.warehouse_id,
            warehouses.name,
            warehouses.location,
            warehouses.created_at
        );
    }
    
    async update(id: number, data: CreateWarehouseDto): Promise<WarehouseEntity> {
        const warehouses = await this.prisma.warehouse.update({
            where: {
                warehouse_id: id,
            },
            data
        })
        return new WarehouseEntity(
            warehouses.warehouse_id,
            warehouses.name,
            warehouses.location,
            warehouses.created_at
        );
    }

    async remove(id: number): Promise<void> {
        await this.prisma.warehouse.delete({
            where: {
                warehouse_id: id
            }
        });
    }
}