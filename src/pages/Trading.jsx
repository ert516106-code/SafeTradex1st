import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Trading() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('spot');

  return (
    <div className="min-h-screen bg-background pb-24">

      <div className="px-4 pt-4 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-semibold text-lg">
          Trading
        </span>
      </div>

      {/* Trading mode buttons */}
      <div className="flex gap-2 px-4 mb-6">

        <button
          onClick={() => setMode('spot')}
          className={`px-4 py-2 rounded ${
            mode === 'spot'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Spot
        </button>

        <button
          onClick={() => setMode('futures')}
          className={`px-4 py-2 rounded ${
            mode === 'futures'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Futures
        </button>

        <button
          onClick={() => setMode('options')}
          className={`px-4 py-2 rounded ${
            mode === 'options'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Options
        </button>

      </div>

      <div className="px-4">

        {mode === 'spot' && (
          <div className="p-4 rounded-lg border">
            Spot Trading Content
          </div>
        )}

        {mode === 'futures' && (
          <div className="p-4 rounded-lg border">
            Futures Trading Content
          </div>
        )}

        {mode === 'options' && (
          <div className="p-4 rounded-lg border">
            Options Trading Content
          </div>
        )}

      </div>

    </div>
  );
}
