import { CategoryGroup, UseState } from "@prisma/client";

export class CategoryEntity {
    constructor ( 
        public readonly category_id: number,
        public readonly group: CategoryGroup,
        public readonly category_name: string,
        public readonly isused: UseState,
    ) {}
}