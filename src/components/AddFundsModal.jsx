import { useState } from 'react';
import { X, ArrowLeft, CreditCard, Bitcoin, ExternalLink } from 'lucide-react';

const BUY_PROVIDERS = [
{
  name: 'Guardarian',
  description: 'Buy crypto with card or bank transfer',
  url: 'https://guardarian.com',
  color: 'bg-blue-500',
  logo: 'G'
},
{
  name: 'Ramp Network',
  description: 'Fast & easy crypto purchases',
  url: 'https://ramp.network',
  color: 'bg-green-500',
  logo: 'R'
},
{
  name: 'Banxa',
  description: 'Global fiat-to-crypto gateway',
  url: 'https://banxa.com',
  color: 'bg-purple-500',
  logo: 'B'
},
{
  name: 'MoonPay',
  description: 'Buy crypto instantly worldwide',
  url: 'https://moonpay.com',
  color: 'bg-indigo-500',
  logo: 'M'
}];


export default function AddFundsModal({ open, onClose, onDepositCrypto }) {
  const [screen, setScreen] = useState('main'); // 'main' | 'buy'

  const handleClose = () => {
    setScreen('main');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border">
        {screen === 'buy' ?
        <button onClick={() => setScreen('main')} className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button> :

        <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        }
        <h2 className="text-base font-bold flex-1">
          {screen === 'main' ? 'Add Funds' : 'Buy Cryptocurrencies'}
        </h2>
      </div>

      {/* Main Screen */}
      {screen === 'main' &&
      <div className="flex-1 px-4 py-6 space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Choose how you'd like to add funds to your account.</p>

          {/* Deposit Crypto */}
          <button
          onClick={() => {handleClose();onDepositCrypto();}}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors text-left">
          
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Bitcoin className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Deposit Cryptocurrencies</p>
              <p className="text-xs text-muted-foreground mt-0.5">Transfer crypto from an external wallet</p>
            </div>
          </button>

          {/* Buy Crypto */}
          <button
          onClick={() => setScreen('buy')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors text-left">
          
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Buy Cryptocurrencies</p>
              <p className="text-xs text-muted-foreground mt-0.5">Purchase crypto using card or bank transfer</p>
            </div>
          </button>
        </div>
      }

      {/* Buy Providers Screen */}
      {screen === 'buy' &&
      <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
            
            <p className="text-xs text-yellow-600 mt-1">These are third-party providers to help you learn how to purchase cryptocurrencies. You will be redirected to their websites.</p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">SELECT PROVIDER</p>

          <div className="space-y-3">
            {BUY_PROVIDERS.map((provider) =>
          <a
            key={provider.name}
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors">
            
                <div className={`w-12 h-12 rounded-full ${provider.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-lg">{provider.logo}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{provider.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </a>
          )}
          </div>
        </div>
      }
    </div>);

}
