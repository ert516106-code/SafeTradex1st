import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShieldCheck,
  BadgeCheck,
  ShieldQuestion,
  Gift,
  Bell,
  Globe,
  Palette,
  LifeBuoy,
  FileText,
  Info,
  LogOut,
  Copy,
  Check,
  UserRound,
  KeyRound,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { getMyKycStatus } from "../services/kycService";

const menuGroups = [
  {
    title: "Account",
    items: [
      { key: "security", label: "Security Center", icon: ShieldCheck, desc: "2FA, password, devices", path: "/security-center" },
      { key: "personal", label: "Personal Information", icon: UserRound, desc: "Name, email, phone", path: "/personal-information" },
      { key: "kyc", label: "KYC Verification", icon: BadgeCheck, desc: "Identity verification", path: "/kyc-verification" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { key: "notifications", label: "Notifications", icon: Bell, desc: "Push, email, SMS", path: "/notification-settings" },
      { key: "language", label: "Language", icon: Globe, desc: "English (US)", path: "/language-settings" },
      { key: "appearance", label: "Appearance", icon: Palette, desc: "Dark", path: "/appearance-settings" },
    ],
  },
  {
    title: "Support",
    items: [
      { key: "help", label: "Help Center", icon: LifeBuoy, desc: "FAQs and support", path: "/help-center" },
      { key: "terms", label: "Terms & Privacy", icon: FileText, desc: "Legal information", path: "/terms-privacy" },
      { key: "about", label: "About SafeTrade", icon: Info, desc: "Version 2.0.0", path: "/about-safetrade" },
    ],
  },
];

export default function ProfileDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) return;

      setAuthEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, uid, account_id")
        .eq("id", user.id)
        .single();

      if (!error && isMounted) {
        setProfile(data);
      }

      const kyc = await getMyKycStatus(user.id);
      if (isMounted) {
        setKycStatus(kyc?.status || null);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const displayName =
    profile?.full_name ||
    profile?.email?.split("@")[0] ||
    authEmail.split("@")[0] ||
    "Loading...";

  const displayEmail = profile?.email || authEmail || "Loading...";

  const accountId =
    profile?.account_id ||
    (profile?.uid ? `STX${profile.uid}` : "Loading...");

  const handleCopyUid = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountId).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLogout = () => {
    onClose();
    navigate("/login");
  };

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(4, 7, 15, 0.6)",
      backdropFilter: "blur(2px)",
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? "auto" : "none",
      transition: "opacity 0.3s ease",
      zIndex: 1000,
    },
    drawer: {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100%",
      width: "min(88vw, 380px)",
      background: "linear-gradient(180deg, #0c1120 0%, #0a0e1a 100%)",
      borderLeft: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "-20px 0 60px rgba(0,0,0,0.55)",
      transform: isOpen ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      zIndex: 1001,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    },
    glowTop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "220px",
      background:
        "radial-gradient(70% 60% at 70% 0%, rgba(59,130,246,0.25) 0%, rgba(10,14,26,0) 70%)",
      pointerEvents: "none",
    },
    header: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 18px 8px",
    },
    headerTitle: {
      fontSize: "17px",
      fontWeight: 600,
      color: "#ffffff",
      letterSpacing: "-0.01em",
    },
    closeBtn: {
      width: "34px",
      height: "34px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    section: {
      position: "relative",
      padding: "12px 16px 0",
    },
    profileCard: {
      borderRadius: "22px",
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(20px)",
      padding: "18px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    avatarWrap: {
      position: "relative",
      flexShrink: 0,
    },
    avatarRing: {
      width: "68px",
      height: "68px",
      borderRadius: "50%",
      padding: "2px",
      background: "linear-gradient(135deg, #3b82f6, #6366f1, #22d3ee)",
      boxShadow: "0 0 20px rgba(59,130,246,0.45)",
    },
    avatarInner: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    badgeDot: {
      position: "absolute",
      bottom: "-2px",
      right: "-2px",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      background: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    username: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#ffffff",
      margin: 0,
    },
    email: {
      fontSize: "11.5px",
      color: "#94a3b8",
      margin: "3px 0 0",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    verifiedPill: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      borderRadius: "999px",
      background: color.bg,
      border: `1px solid ${color.border}`,
      padding: "2px 8px",
      fontSize: "10px",
      fontWeight: 600,
      color: color.text,
      marginTop: "4px",
    }),
    uidRow: {
      marginTop: "6px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      color: "#94a3b8",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    featureCard: (color) => ({
      marginTop: "12px",
      width: "100%",
      textAlign: "left",
      borderRadius: "20px",
      border: `1px solid ${color.border}`,
      background: color.bg,
      backdropFilter: "blur(20px)",
      padding: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    }),
    featureLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    featureIconWrap: (color) => ({
      width: "38px",
      height: "38px",
      borderRadius: "14px",
      background: color.iconBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),
    featureTitle: {
      fontSize: "13.5px",
      fontWeight: 600,
      color: "#fff",
      margin: 0,
    },
    featureDesc: {
      fontSize: "11.5px",
      color: "#94a3b8",
      margin: "2px 0 0",
    },
    groupLabel: {
      padding: "0 4px",
      marginTop: "22px",
      marginBottom: "8px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#64748b",
    },
    groupCard: {
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.09)",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    },
    menuRow: (isLast) => ({
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "13px 14px",
      background: "transparent",
      border: "none",
      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
      cursor: "pointer",
    }),
    menuIconWrap: {
      width: "34px",
      height: "34px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.09)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menuLabel: {
      fontSize: "13.5px",
      fontWeight: 500,
      color: "#fff",
      margin: 0,
    },
    menuDesc: {
      fontSize: "11px",
      color: "#64748b",
      margin: "1px 0 0",
    },
    logoutBtn: {
      width: "100%",
      marginTop: "22px",
      borderRadius: "20px",
      border: "1px solid rgba(239,68,68,0.25)",
      background: "rgba(239,68,68,0.08)",
      color: "#f87171",
      fontSize: "13.5px",
      fontWeight: 600,
      padding: "14px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      cursor: "pointer",
    },
    footerText: {
      textAlign: "center",
      fontSize: "10.5px",
      color: "#475569",
      margin: "16px 0 30px",
    },
  };

  const featureColors = {
    rewards: {
      border: "rgba(245,158,11,0.2)",
      bg: "linear-gradient(90deg, rgba(245,158,11,0.14), rgba(249,115,22,0.08))",
      iconBg: "rgba(245,158,11,0.16)",
    },
    security: {
      border: "rgba(16,185,129,0.2)",
      bg: "linear-gradient(90deg, rgba(16,185,129,0.14), rgba(20,184,166,0.08))",
      iconBg: "rgba(16,185,129,0.16)",
    },
  };

  const kycPillStyles = {
    approved: { bg: "rgba(59,130,246,0.15)", border: "rgba(96,165,250,0.3)", text: "#93c5fd" },
    pending: { bg: "rgba(245,158,11,0.15)", border: "rgba(251,191,36,0.3)", text: "#fbbf24" },
    denied: { bg: "rgba(239,68,68,0.15)", border: "rgba(248,113,113,0.3)", text: "#f87171" },
    none: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", text: "#94a3b8" },
  };

  const kycLabel = { approved: "Verified", pending: "Pending", denied: "Denied" }[kycStatus] || "Not Verified";
  const kycColor = kycPillStyles[kycStatus] || kycPillStyles.none;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.drawer}>
        <div style={styles.glowTop} />

        <div style={styles.header}>
          <span style={styles.headerTitle}>Profile</span>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="#cbd5e1" />
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.profileCard}>
            <div style={styles.avatarWrap}>
              <div style={styles.avatarRing}>
                <div style={styles.avatarInner}>
                  <UserRound size={30} color="#cbd5e1" />
                </div>
              </div>
              <div style={styles.badgeDot}>
                {kycStatus === "approved" ? (
                  <BadgeCheck size={16} color="#60a5fa" />
                ) : (
                  <ShieldQuestion size={16} color="#64748b" />
                )}
              </div>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={styles.username}>{displayName}</p>
              <p style={styles.email}>{displayEmail}</p>
              <span style={styles.verifiedPill(kycColor)}>
                <ShieldCheck size={11} />
                {kycLabel}
              </span>
              <button style={styles.uidRow} onClick={handleCopyUid}>
                <span>Account ID {accountId}</span>
                {copied ? (
                  <Check size={13} color="#34d399" />
                ) : (
                  <Copy size={13} color="#94a3b8" />
                )}
              </button>
            </div>
          </div>

          <button
            style={styles.featureCard(featureColors.rewards)}
            onClick={() => goTo("/rewards-center")}
          >
            <div style={styles.featureLeft}>
              <div style={styles.featureIconWrap(featureColors.rewards)}>
                <Gift size={18} color="#fbbf24" />
              </div>
              <div>
                <p style={styles.featureTitle}>Rewards Center</p>
                <p style={styles.featureDesc}>Claim bonuses and vouchers</p>
              </div>
            </div>
            <ChevronRight size={16} color="#475569" />
          </button>

          <button
            style={styles.featureCard(featureColors.security)}
            onClick={() => goTo("/security-center")}
          >
            <div style={styles.featureLeft}>
              <div style={styles.featureIconWrap(featureColors.security)}>
                <KeyRound size={18} color="#34d399" />
              </div>
              <div>
                <p style={styles.featureTitle}>Security Level: High</p>
                <p style={styles.featureDesc}>All protections enabled</p>
              </div>
            </div>
            <ChevronRight size={16} color="#475569" />
          </button>

          {menuGroups.map((group) => (
            <div key={group.title}>
              <p style={styles.groupLabel}>{group.title}</p>
              <div style={styles.groupCard}>
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isLast = idx === group.items.length - 1;
                  return (
                    <button
                      key={item.key}
                      style={styles.menuRow(isLast)}
                      onClick={() => goTo(item.path)}
                    >
                      <div style={styles.featureLeft}>
                        <div style={styles.menuIconWrap}>
                          <Icon size={16} color="#cbd5e1" />
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <p style={styles.menuLabel}>{item.label}</p>
                          <p style={styles.menuDesc}>{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#475569" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>

          <p style={styles.footerText}>SafeTrade V2 · Version 2.0.0</p>
        </div>
      </div>
    </>
  );
}
