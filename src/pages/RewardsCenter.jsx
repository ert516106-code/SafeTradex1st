import { Gift } from "lucide-react";
import ProfilePageShell from "../components/profile/ProfilePageShell";

const rewards = [
  { title: "Welcome Bonus", desc: "Complete your first deposit", value: "$10" },
  { title: "Trading Voucher", desc: "Trade $500 this week", value: "$5" },
  { title: "Referral Bonus", desc: "Invite a friend to SafeTrade", value: "$20" },
];

export default function RewardsCenter() {
  return (
    <ProfilePageShell title="Rewards Center" subtitle="Claim bonuses and vouchers">
      {rewards.map((reward) => (
        <div
          key={reward.title}
          style={{
            borderRadius: 18,
            border: "1px solid rgba(245,158,11,0.2)",
            background: "linear-gradient(90deg, rgba(245,158,11,0.1), rgba(249,115,22,0.05))",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "rgba(245,158,11,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gift size={18} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{reward.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{reward.desc}</div>
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fbbf24" }}>{reward.value}</div>
        </div>
      ))}
    </ProfilePageShell>
  );
}
