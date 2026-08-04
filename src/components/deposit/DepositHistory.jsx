import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { DepositHeader, GlassCard, DepositCoinLogo, getDepositCoin, formatAmount } from "../../pages/Deposit";

// Helper function to format date based on user's timezone
function formatDateForUser(dateString) {
  const date = new Date(dateString);
  
  // Try to get user's timezone from the browser
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format options
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default function DepositHistory() {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch deposit history from Supabase
  useEffect(() => {
    async function fetchDepositHistory() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError('Please log in to view deposit history');
          setLoading(false);
          return;
        }
        
        setUserId(user.id);

        // Fetch deposits from deposit_history table
        const { data, error: fetchError } = await supabase
          .from('deposit_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching deposit history:', fetchError);
          setError('Failed to load deposit history');
          setLoading(false);
          return;
        }

        setDeposits(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load deposit history');
        setLoading(false);
      }
    }

    fetchDepositHistory();

    // Set up real-time subscription for deposit updates
    const subscription = supabase
      .channel('deposit_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deposit_history',
          filter: `user_id=eq.${userId || ''}`,
        },
        (payload) => {
          // Refresh when a new deposit is added or updated
          fetchDepositHistory();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-emerald-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-rose-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusDot = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'failed':
        return 'bg-rose-400';
      default:
        return 'bg-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DepositHeader title="Deposit History" onBack={() => navigate('/deposit')} />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-white/60">Loading your deposit history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DepositHeader title="Deposit History" onBack={() => navigate('/deposit')} />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-white/60">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DepositHeader title="Deposit History" onBack={() => navigate('/deposit')} />

      <div className="flex-1 px-4 py-6">
        {deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-lg font-bold text-white mb-2">No Deposits Yet</h3>
            <p className="text-sm text-white/40 max-w-xs">
              Your deposit history will appear here once you make your first deposit.
            </p>
            <button
              onClick={() => navigate('/deposit')}
              className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white font-semibold text-sm"
            >
              Make a Deposit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {deposits.map((deposit) => {
              const coin = getDepositCoin(deposit.coin);
              return (
                <GlassCard key={deposit.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <DepositCoinLogo coin={coin} size={44} />
                    <div>
                      <div className="font-semibold text-white">
                        {deposit.coin} - {deposit.network}
                      </div>
                      <div className="text-sm text-white/40">
                        {formatDateForUser(deposit.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">
                      +{formatAmount(deposit.amount)} {deposit.coin}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(deposit.status)}`} />
                      <span className={`text-xs font-semibold ${getStatusColor(deposit.status)}`}>
                        {deposit.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
