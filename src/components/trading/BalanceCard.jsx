export default function BalanceCard({ symbol, balanceUSDT, balanceCoin }) {
  return (
    <div
      style={{
        margin: '0 16px 16px',
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        padding: '12px 14px',
        display: 'flex',
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>USDT Available</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          {(balanceUSDT ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div style={{ width: 1, backgroundColor: '#e5e7eb' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{symbol} Available</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          {(balanceCoin ?? 0).toLocaleString('en-US', { minimumFractionDigits: 6 })}
        </div>
      </div>
    </div>
  );
}
