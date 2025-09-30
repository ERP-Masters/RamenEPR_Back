import { CategoryGroup } from "@prisma/client";

export class CategoryEntity {
    constructor ( 
        public readonly category_id: number,
        public readonly group: CategoryGroup,
        public readonly category_name: string,
    ) {}
}