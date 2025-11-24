import { Injectable } from "@nestjs/common";
import { BranchRequestRepository } from "./repository/branch-request.repository";
import { CreateBranchRequestDto } from "./dto/create-branch-request.dto";
import { UpdateBranchRequestDto } from "./dto/update-branch-request.dto";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class BranchRequestService {
    constructor(private readonly repo: BranchRequestRepository) { }

    async create(dto: CreateBranchRequestDto) {
        return this.repo.create(dto);
    }

    async findAll() {
        return this.repo.findAll();
    }

    async findById(id: number) {
        return this.repo.findById(id);
    }

    async findByPeriod(s: Date, e: Date) {
        return this.repo.findByPeriod(s, e);
    }

    async findByBranch(id: number) {
        return this.repo.findByBranch(id);
    }

    async findByBranchName(name: string) {
        return this.repo.findByBranchName(name);
    }

    async findByStatus(status: OrderStatus) {
        return this.repo.findByStatus(status);
    }

    async update(id: number, dto: UpdateBranchRequestDto) {
        return this.repo.update(id, dto);
    }

    async cancel(id: number) {
        return this.repo.cancel(id);
    }
}
