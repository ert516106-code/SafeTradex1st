import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    "KYC Verification",
    "Set Fund Password",
    "Set Login Password",
    "Language",
    "Notification Settings",
    "Security Center",
    "Account Binding",
    "Service Terms",
    "Online Service",
    "About",
    "Contact",
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <div className="bg-white p-4 flex items-center shadow">
        <button
          onClick={() => navigate("/home")}
          className="text-xl mr-4"
        >
          ←
        </button>

        <h1 className="text-xl font-bold">
          Profile
        </h1>
      </div>

      <div className="bg-white mt-3 p-6">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
            👤
          </div>

          <div>
            <h2 className="font-bold text-lg">
              User
            </h2>

            <p className="text-gray-500">
              UID: 307AC4F
            </p>

            <p className="text-gray-500">
              Credit Score: 100
            </p>

            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
              VIP 0
            </span>

          </div>

        </div>

      </div>

      <div className="bg-white mt-4">

        {menuItems.map((item) => (
          <button
            key={item}
            className="w-full flex justify-between items-center p-4 border-b"
          >
            <span>{item}</span>

            <span>›</span>
          </button>
        ))}

      </div>

      <div className="p-5">

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-bold"
        >
          Log Out
        </button>

      </div>

    </div>
  );
}
