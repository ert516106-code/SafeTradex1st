import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function KYCReviewPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.KYCVerification.list();
    setSubmissions(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (kyc) => {
    await base44.entities.KYCVerification.update(kyc.id, { status: 'approved' });
    toast.success(`KYC approved for ${kyc.user_email}`);
    setSelected(null);
    load();
  };

  const reject = async (kyc) => {
    if (!rejectReason) { toast.error('Please enter a rejection reason'); return; }
    await base44.entities.KYCVerification.update(kyc.id, { status: 'rejected', rejection_reason: rejectReason });
    toast.success(`KYC rejected for ${kyc.user_email}`);
    setSelected(null);
    setRejectReason('');
    load();
  };

  const statusBadge = (status) => ({
    pending:  { label: 'Pending', bg: '#92400e', text: '#fde68a' },
    approved: { label: 'Approved', bg: '#065f46', text: '#a7f3d0' },
    rejected: { label: 'Rejected', bg: '#7f1d1d', text: '#fca5a5' },
  }[status] || { label: status, bg: '#374151', text: '#d1d5db' });

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400 tracking-widest">KYC SUBMISSIONS</p>
        <button onClick={load} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
          <RefreshCw className="w-3 h-3 text-gray-300" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-gray-900 rounded-2xl p-4 animate-pulse h-20" />)}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No KYC submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(kyc => {
            const badge = statusBadge(kyc.status);
            return (
              <div key={kyc.id} className="bg-gray-900 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">{kyc.full_name || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{kyc.user_email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {kyc.id_type?.replace('_', ' ').toUpperCase()} · {kyc.id_number}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Submitted: {new Date(kyc.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: badge.bg, color: badge.text }}>
                    {badge.label}
                  </span>
                </div>

                {/* Document thumbnails */}
                <div className="flex gap-2 mb-3">
                  {[{ url: kyc.id_front_url, label: 'Front' }, { url: kyc.id_back_url, label: 'Back' }, { url: kyc.selfie_url, label: 'Selfie' }].map(doc => (
                    doc.url ? (
                      <a key={doc.label} href={doc.url} target="_blank" rel="noreferrer"
                        className="flex-1 bg-gray-800 rounded-lg overflow-hidden text-center">
                        <img src={doc.url} alt={doc.label} className="w-full h-16 object-cover" />
                        <p className="text-xs text-gray-400 py-1">{doc.label}</p>
                      </a>
                    ) : null
                  ))}
                </div>

                {kyc.status === 'pending' && (
                  <>
                    {selected === kyc.id ? (
                      <div>
                        <input
                          placeholder="Rejection reason..."
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          className="w-full bg-gray-800 rounded-lg px-3 py-2 text-xs text-white outline-none mb-2 placeholder-gray-500"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => reject(kyc)}
                            className="flex-1 h-9 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1">
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                          <button onClick={() => setSelected(null)}
                            className="flex-1 h-9 rounded-full bg-gray-700 text-white text-xs font-bold">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => approve(kyc)}
                          className="flex-1 h-9 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => setSelected(kyc.id)}
                          className="flex-1 h-9 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center gap-1">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </>
                )}

                {kyc.status === 'rejected' && kyc.rejection_reason && (
                  <p className="text-xs text-red-400 mt-1">Reason: {kyc.rejection_reason}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
