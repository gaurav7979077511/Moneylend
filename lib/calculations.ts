export const calculateTotalExpected = (amount: number, roi: number, periodMonths: number) => {
  const interest = (amount * (roi / 100) * periodMonths) / 12;
  return Number((amount + interest).toFixed(2));
};

export const calculateCompletion = (totalExpected: number, received: number) => {
  if (totalExpected <= 0) return 0;
  return Math.min(100, Math.max(0, Number(((received / totalExpected) * 100).toFixed(1))));
};

export const calculateRemaining = (totalExpected: number, received: number) =>
  Number(Math.max(0, totalExpected - received).toFixed(2));
