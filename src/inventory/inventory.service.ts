import { Injectable } from "@nestjs/common";
import { InventoryRepository } from "./repository/inventory.repository";
import { VendorOrderEntity } from "src/vendorOrder/entities/vendorOrder.entity";

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) { }

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

  /**부분 입고 */
  async receivePartialFromOrder(order: VendorOrderEntity, newlyReceivedQty: number) {
    const { id: orderId, wh_id, item_id, quantity: totalOrderedQty, received_quantity } = order;

    // Repository의 부분입고 처리 메서드 사용
    return this.inventoryRepo.receivePartial(
      orderId,              // 발주 ID
      wh_id,                // 창고 ID
      item_id,              // 품목 ID
      totalOrderedQty,      // 총 발주 수량
      received_quantity,    // 현재까지 누적 입고 수량
      newlyReceivedQty,     // 새로 입고된 수량
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

  async findByWarehouseName(warehouseName: string) {
    return this.inventoryRepo.findByWarehouseName(warehouseName);
  }

  async findLotsByItem(itemId: number) {
    return this.inventoryRepo.findLotsByItem(itemId);
  }

  async findAll(status?: string) {
    return this.inventoryRepo.findAll(status);
  }
}