import { DealType, FeeType, DealStatus } from "../../../../common/types";

export interface DealView {
  id?: string | null;
  status: DealStatus;
  openDate: string | null;
  closeDate: string | null;
  exchange: string | null;
  feeType: FeeType;
  feeOpen: number | null;
  feeClose: number | null;
  ticker: string | null;
  assetType: DealType | '' | null;
  units: number | null;
  openPrice: number | null;
  invest: number | null;
  openFeeAmount: number | null;
  takeProfit: number | null;
  takeProfitAmount: number | null;
  takeProfitFeeAmount: number | null;
  takeProfitCostBasis: number | null;
  takeProfitGross: number | null;
  takeProfitPrice: number | null;
  stopLoss: number | null;
  stopLossAmount: number | null;
  stopLossFeeAmount: number | null;
  stopLossCostBasis: number | null;
  stopLossGross: number | null;
  stopLossPrice: number | null;
  closeFeeAmount: number | null;
  closeCostBasis: number | null;
  closeGross: number | null;
  closePrice: number | null;
  profitLoss: number | null;
  profitLossPercent: number | null;
  progress: number | null;
  progressPercent: number | null;
  notes: string | null;
}
