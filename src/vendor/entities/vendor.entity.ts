export class VendorEntity {
    constructor(
        public readonly vendor_id: number,
        public readonly name: string,
        public readonly manager: string,
        public readonly contact: string,
        public readonly address: string,
    ) {}
}