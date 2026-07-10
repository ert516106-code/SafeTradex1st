import React from "react";

export default function DownloadModal({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="w-full max-w-md rounded-3xl bg-[#0C1828] border border-slate-700 text-white p-6">

        <h2 className="text-2xl font-bold">
          Install SafeTradex
        </h2>

        <p className="text-slate-400 mt-2">
          Install SafeTradex for the best experience.
        </p>

        <div className="mt-6 space-y-6">

          <div>
            <h3 className="font-semibold text-sky-400">
              🍎 iPhone / iPad
            </h3>

            <ol className="mt-2 text-sm text-slate-300 space-y-1 list-decimal pl-5">
              <li>Tap the Share button in Safari.</li>
              <li>Select <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong>.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-sky-400">
              🤖 Android (Chrome)
            </h3>

            <ol className="mt-2 text-sm text-slate-300 space-y-1 list-decimal pl-5">
              <li>Tap the ⋮ menu.</li>
              <li>Select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</li>
              <li>Confirm the installation.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-sky-400">
              💻 Windows / Mac
            </h3>

            <ol className="mt-2 text-sm text-slate-300 space-y-1 list-decimal pl-5">
              <li>Open SafeTradex in Chrome or Edge.</li>
              <li>Click the Install icon in the address bar.</li>
              <li>Click <strong>Install</strong>.</li>
            </ol>
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold"
        >
          Close
        </button>

      </div>
    </div>
  );
}
