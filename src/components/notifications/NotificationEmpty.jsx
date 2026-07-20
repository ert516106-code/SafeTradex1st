import { BellOff } from "lucide-react";

export default function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center mb-5">
        <BellOff size={32} className="text-slate-400" />
      </div>
      <h3 className="text-white font-semibold text-base mb-1.5">
        No notifications yet.
      </h3>
      <p className="text-slate-400 text-sm max-w-xs">
        You'll see important account updates here.
      </p>
    </div>
  );
}
