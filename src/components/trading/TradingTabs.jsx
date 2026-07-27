export default function TradingTabs({ side, onChange }) {
  const isBuy = side === 'buy';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 4,
        margin: '4px 16px 16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: isBuy ? 4 : '50%',
          width: 'calc(50% - 4px)',
          borderRadius: 9,
          backgroundColor: isBuy ? '#10b981' : '#ef4444',
          transition: 'left 0.25s ease, background-color 0.25s ease',
        }}
      />
      <button
        onClick={() => onChange('buy')}
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          border: 'none',
          background: 'transparent',
          padding: '10px 0',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          color: isBuy ? '#fff' : '#6b7280',
          transition: 'color 0.2s ease',
        }}
      >
        Buy
      </button>
      <button
        onClick={() => onChange('sell')}
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          border: 'none',
          background: 'transparent',
          padding: '10px 0',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          color: !isBuy ? '#fff' : '#6b7280',
          transition: 'color 0.2s ease',
        }}
      >
        Sell
      </button>
    </div>
  );
}
