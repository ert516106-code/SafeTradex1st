import { useState } from "react";
import { Bell, User } from "lucide-react";
import Logo from "../ui/Logo";
import ProfileDrawer from "../ProfileDrawer";

export default function GreetingHeader({ onBellClick, unreadCount = 0 }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onBellClick}
            aria-label="Notifications"
            style={{
              position: "relative",
              width: 44,
              height: 44,
              borderRadius: 14,
              border: "1px solid #28375a",
              background: "#121B35",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34D399",
                  border: "2px solid #121B35",
                }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-label="Profile"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background:
                "linear-gradient(135deg,#6D5DFF,#4F8CFF)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow:
                "0 8px 20px rgba(109,93,255,.35)",
            }}
          >
            <User size={20} />
          </button>
        </div>
      </div>

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
