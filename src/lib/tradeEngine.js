import { base44 } from '@/api/base44Client';
import { addActiveOrder, removeActiveOrder } from './orderStore';

// Starts a trade that resolves on its own timer, independent of any component's
// lifecycle — so the win/lose result and balance/transaction update still happen
// even if the user closes the trade modal or navigates to another page.
export function startTrade({ coin, isLong, period, numAmount, entryPrice, userEmail, potentialWin, onResolve }) {
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

  setTimeout(async () => {
    removeActiveOrder(orderId);

    const recs = await base44.entities.UserBalance.filter({ user_email: userEmail });
    const rec = recs[0];
    if (!rec) return;
    const mode = rec.mode || 'neutral';
    const win = mode === 'win' ? true : mode === 'lose' ? false : Math.random() > 0.5;

    // On win: restore the original stake + add profit. On lose: nothing (already deducted).
    const profitAmount = win ? potentialWin : -numAmount;
    const updatedBal = win
      ? +((rec.balance ?? 0) + numAmount + potentialWin).toFixed(2)
      : +(rec.balance ?? 0);
    const updatedProfit = +((rec.today_profit ?? 0) + profitAmount).toFixed(2);

    await base44.entities.UserBalance.update(rec.id, { balance: updatedBal, today_profit: updatedProfit });
    await base44.entities.Transaction.create({
      user_email: userEmail,
      type: win ? 'trade_win' : 'trade_lose',
      amount: win ? numAmount + potentialWin : numAmount,
      coin, period: period.label,
      direction: isLong ? 'Long' : 'Short',
      note: win ? `+${potentialWin.toFixed(2)} USDT profit` : `Lost ${numAmount} USDT`,
    });

    if (onResolve) onResolve({ win, profit: profitAmount, updatedBal });
  }, period.seconds * 1000);

  return orderId;
}
