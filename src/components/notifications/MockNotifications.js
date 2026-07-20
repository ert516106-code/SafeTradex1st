export const NOTIFICATION_CATEGORIES = {
  ALL: "all",
  TRANSACTIONS: "transactions",
  SECURITY: "security",
  ANNOUNCEMENTS: "announcements",
};

export const NOTIFICATION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
  CONVERT: "convert",
  SECURITY_ALERT: "security_alert",
  ANNOUNCEMENT: "announcement",
  PROMO: "promo",
};

const now = Date.now();
const minutes = (n) => new Date(now - n * 60 * 1000).toISOString();
const hours = (n) => new Date(now - n * 60 * 60 * 1000).toISOString();
const days = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_NOTIFICATIONS = [
  {
    id: "n-1",
    category: NOTIFICATION_CATEGORIES.TRANSACTIONS,
    type: NOTIFICATION_TYPES.DEPOSIT,
    title: "Deposit Received",
    description: "Your BTC deposit has been credited.",
    message:
      "Your BTC deposit of 0.0452 BTC has been successfully credited to your Spot Wallet. You can now trade or transfer these funds.",
    createdAt: minutes(2),
    read: false,
  },
  {
    id: "n-2",
    category: NOTIFICATION_CATEGORIES.TRANSACTIONS,
    type: NOTIFICATION_TYPES.WITHDRAWAL,
    title: "Withdrawal Submitted",
    description: "Your withdrawal request is being processed.",
    message:
      "Your withdrawal request for 500 USDT to the provided address has been submitted and is currently being processed by our security team. This usually takes up to 30 minutes.",
    createdAt: minutes(15),
    read: false,
  },
  {
    id: "n-3",
    category: NOTIFICATION_CATEGORIES.TRANSACTIONS,
    type: NOTIFICATION_TYPES.TRANSFER,
    title: "Transfer Completed",
    description:
      "Your internal transfer from Funding to Spot has completed successfully.",
    message:
      "Your internal transfer of 1,200 USDT from your Funding Wallet to your Spot Wallet has completed successfully. Funds are now available for trading.",
    createdAt: hours(1),
    read: false,
  },
  {
    id: "n-4",
    category: NOTIFICATION_CATEGORIES.TRANSACTIONS,
    type: NOTIFICATION_TYPES.CONVERT,
    title: "Convert Completed",
    description: "Your BTC has been converted to ETH.",
    message:
      "Your conversion of 0.02 BTC to ETH has completed at the quoted rate. The converted ETH has been credited to your Spot Wallet.",
    createdAt: days(1),
    read: true,
  },
  {
    id: "n-5",
    category: NOTIFICATION_CATEGORIES.SECURITY,
    type: NOTIFICATION_TYPES.SECURITY_ALERT,
    title: "Security Alert",
    description: "New login detected from a new device.",
    message:
      "We detected a new login to your SafeTrade account from a new device and location. If this wasn't you, please secure your account immediately by changing your password and enabling 2FA.",
    createdAt: days(1),
    read: true,
  },
  {
    id: "n-6",
    category: NOTIFICATION_CATEGORIES.ANNOUNCEMENTS,
    type: NOTIFICATION_TYPES.ANNOUNCEMENT,
    title: "Announcement",
    description:
      "SafeTrade will undergo scheduled maintenance this weekend.",
    message:
      "SafeTrade will undergo scheduled system maintenance this weekend from 02:00 to 06:00 UTC. Trading, deposits, and withdrawals may be temporarily unavailable during this window. We appreciate your patience.",
    createdAt: days(2),
    read: true,
  },
];
