import { CategoryGroup, UseState } from "@prisma/client";

export class CategoryEntity {
    constructor ( 
        public readonly id: number,
        public readonly category_id: string,
        public readonly group: CategoryGroup,
        public readonly category_name: string,
        public readonly isused: UseState,
    ) {}
}