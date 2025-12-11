import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error

DATA_PATH = "simulated_demand.csv"

FORECAST_DAYS = 30
TEST_DAYS = 60

# 리드타임 (item_name 기준)
LEAD_TIME = {
    "계란 1판": 3,
    "돈코츠 육수 1팩": 5,
    "쪽파 1봉지": 2,
    "마늘 1봉지": 2,
    "차슈 1kg": 7,
}

BRANCH_WAREHOUSE_MAP = {
    1: "WH001",
    2: "WH002",
    3: "WH003",
    4: "WH004",
    5: "WH005",
}


# ---------------------------
# 0. CSV date 컬럼 처리
# ---------------------------
def load_csv_with_date(path):
    df = pd.read_csv(path)

    if "order_date" in df.columns:
        df["date"] = pd.to_datetime(df["order_date"])
    else:
        raise ValueError("order_date 컬럼이 없습니다. 실제 컬럼: " + ", ".join(df.columns))

    return df


# ---------------------------
# 1. 지점 × 품목 Prophet 예측
# ---------------------------
def forecast_branch_item(df_series):
    df_series = df_series.sort_values("date")

    prophet_df = pd.DataFrame({
        "ds": df_series["date"],
        "y": df_series["order_qty"]
    })

    # 데이터가 너무 적으면 학습 스킵
    if len(prophet_df) <= TEST_DAYS + 100:
        return None

    train_df = prophet_df.iloc[:-TEST_DAYS]
    test_df = prophet_df.iloc[-TEST_DAYS:]

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
    )
    model.fit(train_df)

    # 테스트 구간 예측
    test_pred = model.predict(test_df[["ds"]])

    mae = mean_absolute_error(test_df["y"], test_pred["yhat"])
    mse = mean_squared_error(test_df["y"], test_pred["yhat"])
    rmse = np.sqrt(mse)

    # 미래 예측
    future = model.make_future_dataframe(periods=FORECAST_DAYS)
    future_pred = model.predict(future)
    avg_future = future_pred.iloc[-FORECAST_DAYS:]["yhat"].mean()

    return avg_future, mae, rmse


# ---------------------------
# 2. 창고 적정 재고량 계산
# ---------------------------
def compute_required_stock(avg_daily_demand, safety_stock, lead_time):
    return int(avg_daily_demand * lead_time + safety_stock)


# ---------------------------
# 3. 메인 로직
# ---------------------------
def main():
    df = load_csv_with_date(DATA_PATH)

    branch_item_results = []
    warehouse_demand = {}

    # 지점 × 품목 시계열 예측 (item_name 기준)
    for (branch, item_name), sub_df in df.groupby(["branch_id", "item_name"]):

        # LEAD_TIME에 없는 품목이면 스킵
        if item_name not in LEAD_TIME:
            print(f"LEAD_TIME에 없는 품목이라 스킵: {item_name}")
            continue

        result = forecast_branch_item(sub_df)
        if result is None:
            print(f"데이터 부족으로 스킵: branch={branch}, item={item_name}")
            continue

        avg_future, mae, rmse = result

        warehouse = BRANCH_WAREHOUSE_MAP.get(branch)
        if warehouse is None:
            print(f"BRANCH_WAREHOUSE_MAP에 없는 지점: {branch}")
            continue

        safety_stock = sub_df["safety_stock"].iloc[0]
        lead_time = LEAD_TIME[item_name]

        # 창고 수요 누적
        key = (warehouse, item_name)
        warehouse_demand.setdefault(key, 0.0)
        warehouse_demand[key] += avg_future

        branch_item_results.append({
            "branch_id": branch,
            "item_name": item_name,
            "avg_future_demand": avg_future,
            "mae": mae,
            "rmse": rmse
        })

    # 4. 창고 재고 계획 생성
    warehouse_plan = []

    for (warehouse, item_name), total_demand in warehouse_demand.items():
        safety_stock = df[df["item_name"] == item_name]["safety_stock"].iloc[0]
        lead_time = LEAD_TIME[item_name]

        recommended = compute_required_stock(total_demand, safety_stock, lead_time)

        warehouse_plan.append({
            "warehouse_id": warehouse,
            "item_name": item_name,
            "avg_daily_demand_total": total_demand,
            "safety_stock": safety_stock,
            "lead_time": lead_time,
            "recommended_stock": recommended
        })

    pd.DataFrame(branch_item_results).to_csv("branch_item_forecast.csv", index=False)
    pd.DataFrame(warehouse_plan).to_csv("warehouse_restock_plan.csv", index=False)

    print("\n=== 결과 저장 완료 ===")
    print("branch_item_forecast.csv 생성됨")
    print("warehouse_restock_plan.csv 생성됨")


if __name__ == "__main__":
    main()
