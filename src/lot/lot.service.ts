import { Injectable } from "@nestjs/common";
import { LotTraceRepository } from "./repository/lot.repository";
import { LotEntity } from "./entity/lot.entity";
import { UpdateLotTraceDto } from "./dto/update-lot.dto";


@Injectable()
export class LotTraceService {
    constructor(private readonly LotRepository: LotTraceRepository) { }

    async findAll() {
        return this.LotRepository.findAll();
    }

    async findByLotId(lotId: string) {
        return this.LotRepository.findByLotId(lotId);
    }

    async findByItem(itemId: number) {
        return this.LotRepository.findByItem(itemId);
    }

    async findByWarehouse(warehouseId: number) {
        return this.LotRepository.findByWarehouse(warehouseId);
    }

    async findByInventory(inventoryId: number) {
        return this.LotRepository.findByInventory(inventoryId);
    }

    async findAvailableLots(itemId: number, warehouseId?: number) {
        return this.LotRepository.findAvailableLots(itemId, warehouseId);
    }

    async findByPeriod(start: Date, end: Date) {
        return this.LotRepository.findByPeriod(start, end);
    }

    async findExpiringSoon(days: number) {
        return this.LotRepository.findExpiringSoon(days);
    }

    async findExpired() {
        return this.LotRepository.findExpired();
    }

    async findInboundLot() {
        return this.LotRepository.findInboundLot();
    }

    async findOutboundLot() {
        return this.LotRepository.findOutboundLot();
    }

    async updateLot(lotId: string, dto: UpdateLotTraceDto) {
        return this.LotRepository.updateLot(lotId, dto);
    }
}