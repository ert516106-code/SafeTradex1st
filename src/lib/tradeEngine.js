import { addActiveOrder, removeActiveOrder } from './orderStore';

// Starts a trade that resolves on its own timer, independent of any component's
// lifecycle — so the win/lose result and balance update still happen even if
// the user closes the trade modal or navigates to another page, as long as
// whatever holds onResolve (usually the parent page) stays mounted.
export function startTrade({
  coin,
  isLong,
  period,
  numAmount,
  entryPrice,
  potentialWin,
  balanceAfterDeduction,
  winMode = 'neutral',
  onResolve,
}) {
  const orderId = `order_${Date.now()}`;

  addActiveOrder({
    id: orderId,
    coin,
    direction: isLong ? 'Long' : 'Short',
    period: period.label,
    totalSeconds: period.seconds,
    startTime: Date.now(),
    amount: numAmount,
    entryPrice,
    potentialWin,
  });

  setTimeout(() => {
    removeActiveOrder(orderId);

    const win =
      winMode === 'win' ? true : winMode === 'lose' ? false : Math.random() > 0.5;

    // On win: restore the original stake + add profit. On lose: balance already
    // reflects the deduction, nothing more to subtract.
    const profitAmount = win ? potentialWin : -numAmount;
    const updatedBalance = win
      ? +(balanceAfterDeduction + numAmount + potentialWin).toFixed(2)
      : +balanceAfterDeduction.toFixed(2);

    const transaction = {
      id: orderId,
      type: win ? 'trade_win' : 'trade_lose',
      amount: win ? +(numAmount + potentialWin).toFixed(2) : numAmount,
      coin,
      period: period.label,
      direction: isLong ? 'Long' : 'Short',
      note: win
        ? `+${potentialWin.toFixed(2)} USDT profit`
        : `Lost ${numAmount} USDT`,
      createdAt: Date.now(),
    };

    if (onResolve) onResolve({ win, profit: profitAmount, updatedBalance, transaction });
  }, period.seconds * 1000);

  return orderId;
}
