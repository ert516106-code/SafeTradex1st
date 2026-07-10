import {
  HandCoins,
  ArrowLeftRight,
  Download,
  TrendingUp,
  Wallet,
  User,
  Landmark,
  Repeat,
} from "lucide-react";

const actions = [
  {
    icon: HandCoins,
    label: "Deposit",
    action: "deposit",
  },
  {
    icon: Wallet,
    label: "Withdraw",
    action: "withdraw",
  },
  {
    icon: Repeat,
    label: "Convert",
    action: "convert",
  },
  {
    icon: Download,
    label: "Install App",
    action: "download",
  },
  {
    icon: TrendingUp,
    label: "Markets",
    path: "/markets",
  },
  {
    icon: Landmark,
    label: "Financial",
    path: "/financial",
  },
  {
    icon: ArrowLeftRight,
    label: "Trade",
    path: "/trade",
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
  },
];

export default function HomeQuickActions({
  navigate,
  onDeposit,
  onWithdraw,
  onConvert,
  onDownload,
}) {
  const handleClick = (item) => {
    switch (item.action) {
      case "deposit":
        onDeposit();
        return;

      case "withdraw":
        onWithdraw();
        return;

      case "convert":
        onConvert();
        return;

      case "download":
        onDownload();
        return;

      default:
        if (item.path) {
          navigate(item.path);
        }
    }
  };

  return (
    <div className="mx-5 mt-6">

      <h2 className="text-lg font-bold mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-4 gap-4">

        {actions.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-4 hover:bg-slate-800 transition"
            >

              <div className="flex justify-center">

                <div className="h-12 w-12 rounded-full bg-sky-500/20 flex items-center justify-center">

                  <Icon
                    className="text-sky-400"
                    size={22}
                  />

                </div>

              </div>

              <p className="mt-3 text-xs text-center">
                {item.label}
              </p>

            </button>

          );

        })}

      </div>

    </div>
  );
}
