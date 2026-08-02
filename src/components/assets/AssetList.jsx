export default function AssetList({ assets = [], loading = false }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 72, borderRadius: 16, background: '#1e293b', opacity: 0.3 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>My Assets</div>
      
      {assets.map((asset) => (
        <div
          key={asset.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#1e293b',
            borderRadius: 16,
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#f7931a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {asset.id.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{asset.id}</div>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{asset.symbol}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              ${(asset.balance * (asset.price || 0)).toLocaleString()}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>
              {asset.balance} {asset.symbol}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
