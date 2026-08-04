import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Wallet, History } from 'lucide-react';
import { DepositHeader, GlassCard, IconBadge, FLOW_THEME } from '../../pages/Deposit';
import { supabase } from '../../lib/supabase';

// Helper function to format date based on user's timezone
function formatDateForUser(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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

export default function DepositHome() {
  const navigate = useNavigate();
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentDeposits() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('deposit_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'Completed')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentDeposits(data || []);
      } catch (error) {
        console.error('Error fetching recent deposits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentDeposits();
  }, []);

  const handleDepositCrypto = () => {
    navigate('/deposit/select-coin');
  };

  const handleBuyCrypto = () => {
    navigate('/deposit/buy');
  };

  const handleViewHistory = () => {
    navigate('/deposit/history');
  };

  const handleBack = () => {
    navigate('/assets');
  };

  // If no recent deposits, show empty state
  const hasRecentDeposits = recentDeposits.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <DepositHeader 
        title="Deposit" 
        onBack={handleBack}
        showFlowSwitch={false}
      />

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Description */}
        <div className="mb-2">
          <p className="text-sm text-white/60">
            Add funds to your SafeTrade wallet. Choose your preferred deposit method.
          </p>
        </div>

        {/* Deposit Crypto Card */}
        <div 
          onClick={handleDepositCrypto}
          className="cursor-pointer transition-transform active:scale-[0.98]"
        >
          <GlassCard className="flex items-center gap-4 p-4">
            <IconBadge accent="purple" size={52}>
              <Wallet className="w-6 h-6" />
            </IconBadge>
            <div className="flex-1">
              <h3 className="font-bold text-white">Deposit Cryptocurrency</h3>
              <p className="text-sm text-white/40">Transfer crypto from an external wallet securely.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30" />
          </GlassCard>
        </div>

        {/* Buy Crypto Card */}
        <div 
          onClick={handleBuyCrypto}
          className="cursor-pointer transition-transform active:scale-[0.98]"
        >
          <GlassCard className="flex items-center gap-4 p-4">
            <IconBadge accent="blue" size={52}>
              <CreditCard className="w-6 h-6" />
            </IconBadge>
            <div className="flex-1">
              <h3 className="font-bold text-white">Buy Cryptocurrency</h3>
              <p className="text-sm text-white/40">Purchase crypto using trusted third-party providers.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30" />
          </GlassCard>
        </div>

        {/* Recent Deposits Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Deposits</h3>
            <button 
              onClick={handleViewHistory}
              className="text-sm text-[#A78BFA] hover:text-[#8B5CF6] transition"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-white/40">Loading...</div>
            </div>
          ) : hasRecentDeposits ? (
            <div className="space-y-2">
              {recentDeposits.map((deposit) => (
                <GlassCard key={deposit.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold text-sm">
                        {deposit.coin?.slice(0, 2) || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {deposit.coin} - {deposit.network}
                      </div>
                      <div className="text-xs text-white/40">
                        {formatDateForUser(deposit.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400 text-sm">
                      +{deposit.amount} {deposit.coin}
                    </div>
                    <div className="text-xs text-white/40">Completed</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5">
              <div className="text-4xl mb-3">🏦</div>
              <p className="text-white/40 text-sm">No deposits yet</p>
              <p className="text-white/20 text-xs mt-1">Your completed deposits will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
