import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

const typeLabels = { phone: '📱 Phone Number', google: 'G  Google Account', hardware_key: '🔑 Hardware Key' };

export default function AccountBindingsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.AccountBinding.list('-created_date', 100);
    setRequests(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (req) => {
    await base44.entities.AccountBinding.update(req.id, { status: 'approved' });
    toast.success(`Approved ${typeLabels[req.binding_type]} for ${req.user_email}`);
    load();
  };

  const reject = async (req) => {
    await base44.entities.AccountBinding.update(req.id, { status: 'rejected', rejection_reason: 'Rejected by admin' });
    toast.error(`Rejected binding request`);
    load();
  };

  if (loading) return <div className="text-center py-10 text-gray-500 animate-pulse">Loading...</div>;
  if (requests.length === 0) return <div className="text-center py-10 text-gray-500"><p>No binding requests yet.</p></div>;

  return (
    <div className="px-5 pt-4 space-y-3">
      <p className="text-xs font-semibold text-gray-400 tracking-widest">BINDING REQUESTS</p>
      {requests.map(req => (
        <div key={req.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-sm text-white">{typeLabels[req.binding_type] || req.binding_type}</p>
              <p className="text-xs text-gray-400 mt-0.5">{req.user_email}</p>
              {req.binding_value && <p className="text-xs text-gray-300 mt-0.5">Value: {req.binding_value}</p>}
              <p className="text-xs text-gray-500 mt-0.5">{new Date(req.created_date).toLocaleString()}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              req.status === 'approved' ? 'bg-emerald-500 text-white' :
              req.status === 'rejected' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {req.status.toUpperCase()}
            </span>
          </div>
          {req.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button onClick={() => approve(req)}
                className="flex-1 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => reject(req)}
                className="flex-1 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
