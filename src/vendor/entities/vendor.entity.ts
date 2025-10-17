import { UseState } from "@prisma/client";

export class VendorEntity {
    constructor(
        public readonly vendor_id: number,
        public readonly name: string,
        public readonly manager: string,
        public readonly contact: string,
        public readonly isused: UseState,
        public readonly address: string,
    ) {}
}