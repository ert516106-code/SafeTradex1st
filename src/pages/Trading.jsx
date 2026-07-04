import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TradingModeSelector from '../components/trading/TradingModeSelector';
import SpotTrading from '../components/trading/SpotTrading';
import FuturesTrading from '../components/trading/FuturesTrading';
import OptionsTrading from '../components/trading/OptionsTrading';

export default function Trading() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('spot');

  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold">Trading</span>
      </div>

      <TradingModeSelector mode={mode} onChange={setMode} />

      <div className={mode === 'spot' ? 'block' : 'hidden'}><SpotTrading /></div>
      <div className={mode === 'futures' ? 'block' : 'hidden'}><FuturesTrading /></div>
      <div className={mode === 'options' ? 'block' : 'hidden'}><OptionsTrading /></div>
    </div>
  );
}
