import Logo from "../components/ui/Logo";
import ProfilePageShell from "../components/profile/ProfilePageShell";

export default function AboutSafeTrade() {
  return (
    <ProfilePageShell title="About SafeTrade" subtitle="Version 2.0.0">
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Logo />
        <div style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>
          SafeTradex is a non-custodial crypto exchange wallet that brings secure asset management, spot trading, futures trading, staking, and real-time market tracking into one modern, mobile-friendly platform. Designed with user ownership at its core, SafeTradex empowers individuals to buy, hold, swap, trade, and grow their digital assets while maintaining full control of their wallets and private keys. The platform provides a seamless experience with live portfolio tracking, transaction history, market insights, and intuitive tools that make managing crypto simple and transparent.

SafeTradex is built for a wide range of users—from beginners entering the world of cryptocurrency to experienced traders seeking fast execution and advanced trading features. New users benefit from a clean, guided interface that makes buying, storing, and exploring digital assets straightforward, while active traders can access spot and futures markets with real-time pricing, market analytics, and responsive trading tools. Long-term investors can also grow their holdings through flexible staking opportunities, rewards programs, and portfolio management features designed for sustainable asset growth.

As a non-custodial platform, SafeTradex does not take ownership of users' digital assets. Users retain control over their wallets, allowing them to securely manage their funds while interacting with the platform's trading and investment features. This approach promotes greater transparency, security, and financial independence by ensuring that users remain in control of their own assets at all times.

SafeTradex is developed and maintained by an independent product and engineering team dedicated to building secure, accessible, and user-focused cryptocurrency solutions. We continuously enhance the platform based on community feedback, emerging blockchain technologies, market developments, and industry best practices. Our mission is to make cryptocurrency trading and digital asset management simple, secure, and accessible for everyone while embracing the principles of decentralization and user ownership.
        </div>
      </div>
    </ProfilePageShell>
  );
}
