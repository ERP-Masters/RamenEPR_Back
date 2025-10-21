import { UseState } from "@prisma/client";

export class BranchEntity {
    constructor (
        public readonly id: number,
        public readonly branch_id: string,
        public readonly name: string,
        public readonly location: string,
        public readonly detail_address: string,
        public readonly store_owner: string,
        public readonly contact: string,
        public readonly isused: UseState,
        public readonly created_at: Date,
    ) {}
}