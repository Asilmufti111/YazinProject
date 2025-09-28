// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";          // use a transparent PNG/SVG
import type { User } from "../types";

type Props = {
  user: User | null;
  onLogout: () => Promise<void> | void;
};

export default function Header({ user, onLogout }: Props) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Logo"
            className="h-20 md:h-24 w-auto block select-none"
          />
          {/* Optional brand text; remove if not needed */}
          {/* <span className="text-xl font-semibold text-gray-800">Yazin</span> */}
        </Link>

        {/* Right: User name + Logout (only when logged in) */}
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm md:text-base text-gray-700 font-medium">
              {user.name || "Account"}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm md:text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          // When logged out, show nothing (or add Login link if desired)
          <div />
        )}
      </div>
    </header>
  );
}
