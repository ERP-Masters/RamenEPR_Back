import { Controller, Get } from '@nestjs/common';
import { ForecastService } from './forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  // Python 실행 후 예측 결과 반환
  @Get('run')
  async runForecast() {
    return this.forecastService.runForecast();
  }

  // branch_item_forecast.csv 조회
  @Get('branch')
  async getBranch() {
    return this.forecastService.getBranchForecast();
  }

  // warehouse_restock_plan.csv 조회
  @Get('warehouse')
  async getWarehouse() {
    return this.forecastService.getWarehousePlan();
  }
}