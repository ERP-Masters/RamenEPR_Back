import { Injectable } from "@nestjs/common";
import { LotTraceRepository } from "./repository/lot.repository";
import { LotEntity } from "./entity/lot.entity";

@Injectable()
export class LotTraceService {
    constructor(private readonly LotRepository: LotTraceRepository) { }

    async findLotsByItem(itemId: number) {
        return this.LotRepository.findLotsByItem(itemId);
    }
}