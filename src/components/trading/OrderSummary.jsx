const Row = ({ label, value, bold, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}>
    <span style={{ color: '#6b7280' }}>{label}</span>
    <span style={{ fontWeight: bold ? 700 : 500, color: color || '#111' }}>{value}</span>
  </div>
);

export default function OrderSummary({ side, orderType, symbol, price, amount, total, feeRate }) {
  const fee = +(total * feeRate).toFixed(4);
  const isBuy = side === 'buy';
  const receive = isBuy ? amount : Math.max(total - fee, 0);

  return (
    <div
      style={{
        margin: '4px 16px 16px',
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        padding: '14px 16px',
      }}
    >
      <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Order Summary</p>
      <Row label="Order Type" value={`${isBuy ? 'Buy' : 'Sell'} · ${orderType === 'market' ? 'Market' : 'Limit'}`} />
      <Row label="Price" value={`${price ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} USDT`} />
      <Row label="Amount" value={`${amount ? amount.toLocaleString('en-US', { minimumFractionDigits: 6 }) : '0'} ${symbol}`} />
      <Row label="Estimated Total" value={`${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`} />
      <Row label={`Fees (${(feeRate * 100).toFixed(2)}%)`} value={`${fee.toLocaleString('en-US', { minimumFractionDigits: 4 })} USDT`} />
      <Row
        label="You Receive"
        bold
        color={isBuy ? '#10b981' : '#10b981'}
        value={isBuy ? `${amount ? amount.toLocaleString('en-US', { minimumFractionDigits: 6 }) : '0'} ${symbol}` : `${receive.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`}
      />
    </div>
  );
}
