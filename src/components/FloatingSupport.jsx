import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const SUPPORT_URL = "https://omni-chubby-assist-flow.base44.app";

export default function FloatingSupport() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Open Support"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Full Screen Support */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>

              <div>
                <h2 className="font-semibold text-base">
                  SafeTradex Customer Support
                </h2>
                <p className="text-xs text-blue-100">
                  ● Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Support Website */}
          <iframe
            src={SUPPORT_URL}
            title="SafeTradex Support"
            className="flex-1 w-full border-0"
          />
        </div>
      )}
    </>
  );
}
