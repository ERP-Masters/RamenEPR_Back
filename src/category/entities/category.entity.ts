import { Unit } from "@prisma/client";

export class CategoryEntity {
    constructor ( 
        public readonly category_id: number,
        public readonly group: Unit,
        public readonly category_name: string,
    ) {}
}