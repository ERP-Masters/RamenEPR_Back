import { Injectable, NotFoundException } from "@nestjs/common";
import { BranchRequestRepository } from "./repository/branch-request.repository";
import { CreateBranchRequestDto } from "./dto/create-branch-request.dto";
import { UpdateBranchRequestDto } from "./dto/update-branch-request.dto";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class BranchRequestService {
    constructor(private readonly BranchRequestRepo: BranchRequestRepository) {}

    async create(dto: CreateBranchRequestDto) {
        return this.BranchRequestRepo.create(dto);
    }

    async findAll() {
        return this.BranchRequestRepo.findAll();
    }

    async findById(id: number) {
        return this.BranchRequestRepo.findById(id);
    }

    async findByPeriod(start: Date, end: Date) {
        return this.BranchRequestRepo.findByPeriod(start, end);
    }

    async findByBranch(id: number) {
        return this.BranchRequestRepo.findByBranch(id);
    }

    async findByBranchName(name: string){
        return this.BranchRequestRepo.findByBranchName(name);
    }

    async findByStatus(status: OrderStatus) {
        return this.BranchRequestRepo.findByStatus(status);
    }

    async update(id: number, dto:UpdateBranchRequestDto) {
        return this.BranchRequestRepo.update(id, dto);
    }

    async cancel(id: number) {
        return this.BranchRequestRepo.cancel(id);
    }
}