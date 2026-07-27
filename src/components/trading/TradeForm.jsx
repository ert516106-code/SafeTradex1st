const QUICK_PCTS = [25, 50, 75, 100];

export default function TradeForm({
  side,
  symbol,
  orderType,
  onOrderTypeChange,
  price,
  onPriceChange,
  amount,
  onAmountChange,
  total,
  currentPrice,
  onQuickPct,
}) {
  const isMarket = orderType === 'market';
  const isBuy = side === 'buy';

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['market', 'limit'].map((t) => (
          <button
            key={t}
            onClick={() => onOrderTypeChange(t)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 10,
              border: orderType === t ? '1px solid #111827' : '1px solid #e5e7eb',
              backgroundColor: orderType === t ? '#111827' : '#fff',
              color: orderType === t ? '#fff' : '#6b7280',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t} Order
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Price</label>
      <div style={{ position: 'relative', margin: '6px 0 14px' }}>
        <input
          type="number"
          value={isMarket ? currentPrice : price}
          onChange={(e) => onPriceChange(e.target.value)}
          disabled={isMarket}
          placeholder="0.00"
          style={{
            width: '100%',
            height: 46,
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '0 52px 0 14px',
            fontSize: 14,
            fontWeight: 600,
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: isMarket ? '#f9fafb' : '#fff',
            color: isMarket ? '#9ca3af' : '#111',
          }}
        />
        <span style={{ position: 'absolute', right: 14, top: 13, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
          USDT
        </span>
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Amount</label>
      <div style={{ position: 'relative', margin: '6px 0 10px' }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          style={{
            width: '100%',
            height: 46,
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '0 52px 0 14px',
            fontSize: 14,
            fontWeight: 600,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <span style={{ position: 'absolute', right: 14, top: 13, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
          {symbol}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {QUICK_PCTS.map((pct) => (
          <button
            key={pct}
            onClick={() => onQuickPct(pct)}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: 9,
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {pct}%
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Total</label>
      <div style={{ position: 'relative', margin: '6px 0 4px' }}>
        <input
          type="text"
          readOnly
          value={total ? total.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
          placeholder="0.00"
          style={{
            width: '100%',
            height: 46,
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '0 52px 0 14px',
            fontSize: 14,
            fontWeight: 600,
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#f9fafb',
            color: '#111',
          }}
        />
        <span style={{ position: 'absolute', right: 14, top: 13, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
          USDT
        </span>
      </div>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 16px' }}>
        {isBuy ? 'Estimated cost to buy this amount' : 'Estimated proceeds from selling this amount'}
      </p>
    </div>
  );
}
