import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Pencil, Check, X, Plus, Trash2 } from 'lucide-react';

const DEFAULT_ADDRESSES = [
  { symbol: 'USDT', network: 'TRC20 (TRON)',       address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE' },
  { symbol: 'USDT', network: 'ERC20 (Ethereum)',   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f89590' },
  { symbol: 'USDC', network: 'ERC20 (Ethereum)',   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f89590' },
  { symbol: 'USDC', network: 'SOL (Solana)',        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
  { symbol: 'BTC',  network: 'Bitcoin Network',    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ETH',  network: 'ERC20 (Ethereum)',   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f89590' },
  { symbol: 'SOL',  network: 'Solana Network',     address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
];

export default function DepositAddressPanel() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({}); // id -> draft address string
  const [adding, setAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ symbol: 'USDT', network: '', address: '' });

  const loadAddresses = async () => {
    setLoading(true);
    const records = await base44.entities.DepositAddress.list();
    setAddresses(records);
    setLoading(false);
  };

  useEffect(() => { loadAddresses(); }, []);

  const saveEdit = async (record) => {
    const draft = editing[record.id];
    if (!draft || !draft.trim()) return;
    await base44.entities.DepositAddress.update(record.id, { address: draft.trim() });
    toast.success(`${record.symbol} (${record.network}) address updated`);
    setEditing(e => { const n = { ...e }; delete n[record.id]; return n; });
    loadAddresses();
  };

  const cancelEdit = (id) => setEditing(e => { const n = { ...e }; delete n[id]; return n; });

  const deleteRecord = async (id) => {
    await base44.entities.DepositAddress.delete(id);
    toast.success('Address removed');
    loadAddresses();
  };

  const addNew = async () => {
    if (!newEntry.network.trim() || !newEntry.address.trim()) { toast.error('Fill in all fields'); return; }
    await base44.entities.DepositAddress.create(newEntry);
    toast.success('Address added');
    setAdding(false);
    setNewEntry({ symbol: 'USDT', network: '', address: '' });
    loadAddresses();
  };

  const grouped = addresses.reduce((acc, r) => {
    if (!acc[r.symbol]) acc[r.symbol] = [];
    acc[r.symbol].push(r);
    return acc;
  }, {});

  if (loading) return <div className="text-center py-10 text-gray-400 animate-pulse">Loading addresses...</div>;

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400 tracking-widest">DEPOSIT ADDRESSES</p>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-full text-white text-xs font-bold">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Add new */}
      {adding && (
        <div className="bg-gray-800 rounded-2xl p-4 mb-4 space-y-2">
          <select value={newEntry.symbol} onChange={e => setNewEntry(v => ({ ...v, symbol: e.target.value }))}
            className="w-full bg-gray-700 text-white text-sm rounded-xl px-3 py-2 outline-none">
            {['USDT','USDC','BTC','ETH','SOL'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input placeholder="Network name (e.g. TRC20)" value={newEntry.network}
            onChange={e => setNewEntry(v => ({ ...v, network: e.target.value }))}
            className="w-full bg-gray-700 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-gray-500" />
          <input placeholder="Wallet address" value={newEntry.address}
            onChange={e => setNewEntry(v => ({ ...v, address: e.target.value }))}
            className="w-full bg-gray-700 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-gray-500 font-mono" />
          <div className="flex gap-2">
            <button onClick={addNew} className="flex-1 h-9 bg-emerald-600 rounded-xl text-xs font-bold text-white">Save</button>
            <button onClick={() => setAdding(false)} className="flex-1 h-9 bg-gray-700 rounded-xl text-xs font-bold text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      {/* Grouped by coin */}
      {Object.entries(grouped).map(([symbol, records]) => (
        <div key={symbol} className="mb-5">
          <p className="text-xs text-gray-400 font-bold mb-2">{symbol}</p>
          <div className="space-y-3">
            {records.map(record => (
              <div key={record.id} className="bg-gray-900 rounded-2xl p-3 border border-gray-700">
                <p className="text-[10px] text-gray-400 mb-1">{record.network}</p>
                {editing[record.id] !== undefined ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={editing[record.id]}
                      onChange={e => setEditing(v => ({ ...v, [record.id]: e.target.value }))}
                      className="flex-1 bg-gray-800 text-white text-xs font-mono rounded-lg px-2 py-1.5 outline-none border border-primary"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(record)} className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button onClick={() => cancelEdit(record.id)} className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-gray-300" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className={`flex-1 text-xs font-mono break-all ${record.address ? 'text-white' : 'text-gray-500 italic'}`}>
                      {record.address || 'Tap ✏️ to set address'}
                    </p>
                    <button onClick={() => setEditing(v => ({ ...v, [record.id]: record.address }))}
                      className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                      <Pencil className="w-3 h-3 text-gray-300" />
                    </button>
                    <button onClick={() => deleteRecord(record.id)}
                      className="w-7 h-7 bg-red-900/60 rounded-full flex items-center justify-center shrink-0">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
