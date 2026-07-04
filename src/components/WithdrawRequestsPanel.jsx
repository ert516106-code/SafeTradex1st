import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Check, X, Clock } from 'lucide-react';

export default function WithdrawalRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [showReject, setShowReject] = useState({});

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.WithdrawalRequest.list('-created_date');
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (req) => {
    setUpdating(u => ({ ...u, [req.id]: true }));
    await base44.entities.WithdrawalRequest.update(req.id, { status: 'approved' });
    toast.success(`Approved withdrawal for ${req.user_email}`);
    await load();
    setUpdating(u => ({ ...u, [req.id]: false }));
  };

  const reject = async (req) => {
    const reason = rejectReason[req.id] || '';
    setUpdating(u => ({ ...u, [req.id]: true }));
    await base44.entities.WithdrawalRequest.update(req.id, { status: 'rejected', rejection_reason: reason });
    toast.success(`Rejected withdrawal for ${req.user_email}`);
    setShowReject(s => ({ ...s, [req.id]: false }));
    await load();
    setUpdating(u => ({ ...u, [req.id]: false }));
  };

  const pending = requests.filter(r => r.status === 'pending');
  const processed = requests.filter(r => r.status !== 'pending');

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest">WITHDRAWAL REQUESTS</p>
          {pending.length > 0 && (
            <span className="inline-block mt-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pending.length} pending
            </span>
          )}
        </div>
        <button onClick={load} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-gray-900 rounded-2xl h-24 animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No withdrawal requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <>
              <p className="text-xs text-amber-400 font-semibold">PENDING ({pending.length})</p>
              {pending.map(req => (
                <RequestCard key={req.id} req={req} updating={!!updating[req.id]}
                  onApprove={() => approve(req)}
                  onReject={() => setShowReject(s => ({ ...s, [req.id]: !s[req.id] }))}
                  showReject={!!showReject[req.id]}
                  rejectReason={rejectReason[req.id] || ''}
                  onReasonChange={v => setRejectReason(r => ({ ...r, [req.id]: v }))}
                  onConfirmReject={() => reject(req)}
                />
              ))}
            </>
          )}
          {processed.length > 0 && (
            <>
              <p className="text-xs text-gray-400 font-semibold mt-4">PROCESSED ({processed.length})</p>
              {processed.map(req => (
                <RequestCard key={req.id} req={req} updating={false} processed />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, updating, onApprove, onReject, showReject, rejectReason, onReasonChange, onConfirmReject, processed }) {
  const statusColor = { pending: 'text-amber-400', approved: 'text-emerald-400', rejected: 'text-red-400' }[req.status];
  const statusIcon = { pending: <Clock className="w-3 h-3" />, approved: <Check className="w-3 h-3" />, rejected: <X className="w-3 h-3" /> }[req.status];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm truncate max-w-[180px] text-white">{req.user_email}</p>
          <p className="text-xs text-gray-400 mt-0.5">{new Date(req.created_date).toLocaleString()}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${statusColor}`}>
          {statusIcon} {req.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-800 rounded-xl px-3 py-2">
          <p className="text-gray-400 mb-0.5">Coin</p>
          <p className="font-bold text-white">{req.coin}</p>
        </div>
        <div className="bg-gray-800 rounded-xl px-3 py-2">
          <p className="text-gray-400 mb-0.5">Amount</p>
          <p className="font-bold text-white">{req.amount} {req.coin}</p>
        </div>
        <div className="bg-gray-800 rounded-xl px-3 py-2">
          <p className="text-gray-400 mb-0.5">Network</p>
          <p className="font-bold text-white truncate">{req.network}</p>
        </div>
        <div className="bg-gray-800 rounded-xl px-3 py-2">
          <p className="text-gray-400 mb-0.5">Fee</p>
          <p className="font-bold text-white">{req.fee} {req.coin}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl px-3 py-2 mb-3 text-xs">
        <p className="text-gray-400 mb-0.5">Destination Address</p>
        <p className="font-mono text-white text-[11px] break-all">{req.address}</p>
      </div>

      {req.rejection_reason && (
        <div className="bg-red-900/30 rounded-xl px-3 py-2 mb-3 text-xs">
          <p className="text-red-400">Reason: {req.rejection_reason}</p>
        </div>
      )}

      {!processed && (
        <>
          <div className="flex gap-2">
            <button disabled={updating} onClick={onApprove}
              className="flex-1 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50">
              <Check className="w-3 h-3" /> Approve
            </button>
            <button disabled={updating} onClick={onReject}
              className="flex-1 h-9 rounded-full bg-red-700 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50">
              <X className="w-3 h-3" /> Reject
            </button>
          </div>
          {showReject && (
            <div className="mt-3 flex gap-2">
              <input placeholder="Rejection reason (optional)" value={rejectReason}
                onChange={e => onReasonChange(e.target.value)}
                className="flex-1 bg-gray-800 text-white text-xs rounded-xl px-3 py-2 outline-none placeholder-gray-500" />
              <button onClick={onConfirmReject}
                className="px-4 rounded-xl bg-red-600 text-white text-xs font-bold">Confirm</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
