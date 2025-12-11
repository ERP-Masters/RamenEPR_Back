import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ForecastService {

  // Python 예측 스크립트 실행
  private runPythonScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '..', '..', 'src', 'AI', 'model.py');

      const proc = spawn('python3', [scriptPath], {
        cwd: path.dirname(scriptPath),
      });

      proc.stdout.on('data', (data) => console.log('[PYTHON]', data.toString()));
      proc.stderr.on('data', (data) => console.error('[PYTHON ERROR]', data.toString()));

      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python exited with code ${code}`));
      });
    });
  }

  // CSV 파싱 공통 함수
  private parseCsv(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException(`CSV 파일 없음: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const lines = raw.trim().split('\n');

    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) =>
      line.split(',').map((v) => v.trim()),
    );

    return { headers, rows };
  }

  // 전체 실행 + 반환
  async runForecast() {
    await this.runPythonScript();

    const branchPath = path.join(__dirname, '..', '..', 'src', 'AI', 'branch_item_forecast.csv');
    const warehousePath = path.join(__dirname, '..', '..', 'src', 'AI', 'warehouse_restock_plan.csv');

    const branchCsv = this.parseCsv(branchPath);
    const warehouseCsv = this.parseCsv(warehousePath);

    const toJsonArray = (headers: string[], rows: string[][]) =>
      rows.map((cols) =>
        headers.reduce((obj, key, idx) => {
          const value = cols[idx];
          obj[key] = isNaN(Number(value)) ? value : Number(value);
          return obj;
        }, {}),
      );

    return {
      branch_forecast: toJsonArray(branchCsv.headers, branchCsv.rows),
      warehouse_plan: toJsonArray(warehouseCsv.headers, warehouseCsv.rows)
    };
  }

  // 개별 조회 API
  async getBranchForecast() {
    const branchPath = path.join(__dirname, '..', '..', 'python', 'branch_item_forecast.csv');
    const { headers, rows } = this.parseCsv(branchPath);

    return rows.map((cols) =>
      headers.reduce((obj, key, idx) => {
        const v = cols[idx];
        obj[key] = isNaN(Number(v)) ? v : Number(v);
        return obj;
      }, {}),
    );
  }

  async getWarehousePlan() {
    const warehousePath = path.join(__dirname, '..', '..', 'python', 'warehouse_restock_plan.csv');
    const { headers, rows } = this.parseCsv(warehousePath);

    return rows.map((cols) =>
      headers.reduce((obj, key, idx) => {
        const v = cols[idx];
        obj[key] = isNaN(Number(v)) ? v : Number(v);
        return obj;
      }, {}),
    );
  }
}