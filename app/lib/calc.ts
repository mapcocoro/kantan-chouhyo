import type { Item } from './types';

// 計算ユーティリティ関数

export interface CalcResult {
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
}

export function calculateTotals(items: Item[]): CalcResult {
  const subTotal = items.reduce((acc, item) => {
    return acc + (item.qty * item.unitPrice);
  }, 0);

  const taxTotal = items.reduce((acc, item) => {
    const lineTotal = item.qty * item.unitPrice;
    return acc + Math.round(lineTotal * item.taxRate / 100);
  }, 0);

  return {
    subTotal,
    taxTotal,
    grandTotal: subTotal + taxTotal
  };
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '0';
  return Number(amount).toLocaleString('ja-JP');
}

export function formatPercent(rate: number): string {
  return `${rate}%`;
}