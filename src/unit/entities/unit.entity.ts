import { UseState } from "@prisma/client";

export class UnitEntity {
    constructor (
        public readonly unit_id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly isused: UseState
    ) {}
}