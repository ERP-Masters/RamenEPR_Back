import { UseState } from "@prisma/client";

export class VendorEntity {
    constructor(
        public readonly id: number,
        public readonly vendor_id: string,
        public readonly name: string,
        public readonly manager: string,
        public readonly contact: string,
        public readonly isused: UseState,
        public readonly address: string,
    ) {}
}