import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User } from "lucide-react";
import Logo from "../ui/Logo";
import ProfileDrawer from "../ProfileDrawer";

export default function GreetingHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

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
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            style={{
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
