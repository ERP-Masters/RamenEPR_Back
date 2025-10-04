export class BranchEntity {
    constructor ( 
        public readonly branch_id: number,
        public readonly name: string,
        public readonly location: string,
        public readonly detail_address: string,
        public readonly store_owner: string,
        public readonly contact: string,
        public readonly created_at: Date,
    ) {}
}