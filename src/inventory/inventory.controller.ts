import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /** 수동 입고 (테스트용) */
  @Post("receive")
  async receive(
    @Body()
    body: {
      warehouse_id: number;
      item_id: number;
      quantity: number;
      manufacture_date?: string;
      expiry_date?: string;
    },
  ) {
    return this.inventoryService.receiveManual(
      body.warehouse_id,
      body.item_id,
      body.quantity,
      body.manufacture_date ? new Date(body.manufacture_date) : undefined,
      body.expiry_date ? new Date(body.expiry_date) : undefined,
    );
  }

  /** 창고별 재고 조회 */
  @Get("warehouse/:warehouseId")
  async findByWarehouse(@Param("warehouseId") warehouseId: number) {
    return this.inventoryService.findByWarehouse(+warehouseId);
  }

  /** LOT 조회 */
  @Get("lot/:itemId")
  async findLotsByItem(@Param("itemId") itemId: number) {
    return this.inventoryService.findLotsByItem(+itemId);
  }

  /** 전체 재고 조회 */
  @Get()
  async findAll(@Query("status") status?: string) {
    return this.inventoryService.findAll(status);
  }
}