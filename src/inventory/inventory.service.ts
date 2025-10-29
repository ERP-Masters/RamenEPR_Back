import { Injectable } from "@nestjs/common";
import { InventoryRepository } from "./repository/inventory.repository";
import { VendorOrderEntity } from "src/vendorOrder/entities/vendorOrder.entity";

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  /** 거래처 발주가 완료되었을 때 자동 입고 처리 */
  async receiveStockFromOrder(order: VendorOrderEntity | any) {
    return this.inventoryRepo.receive(
      order.wh_id,
      order.item_id,
      order.quantity,
      new Date(),
      undefined,
    );
  }

  /** 수동 입고 */
  async receiveManual(
    warehouseId: number,
    itemId: number,
    quantity: number,
    manufactureDate?: Date,
    expiryDate?: Date,
  ) {
    return this.inventoryRepo.receive(warehouseId, itemId, quantity, manufactureDate, expiryDate);
  }

  async findByWarehouse(warehouseId: number) {
    return this.inventoryRepo.findByWarehouse(warehouseId);
  }

  async findLotsByItem(itemId: number) {
    return this.inventoryRepo.findLotsByItem(itemId);
  }

  async findAll(status?: string) {
    return this.inventoryRepo.findAll(status);
  }
}