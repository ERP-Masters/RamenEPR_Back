import { Injectable } from "@nestjs/common";
import { InventoryRepository } from "./repository/inventory.repository";
import { VendorOrderEntity } from "src/vendorOrder/entities/vendorOrder.entity";

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  /**
   * 거래처 발주가 완료되었을 때 자동 입고 처리
   */
  async receiveStockFromOrder(order: VendorOrderEntity) {
    return this.inventoryRepo.receive(
      order.wh_id,
      order.item_id,
      order.quantity,
      new Date(), // manufacture_date
      undefined,  // expiry_date는 품목 기본값 사용
    );
  }
}