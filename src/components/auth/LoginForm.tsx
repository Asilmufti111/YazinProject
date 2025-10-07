// /src/components/auth/LoginForm.tsx
// Styled login form: asks for National ID + Email + Password.
// CHANGED: Added National ID field and included it in the onSubmit payload.
// CHANGED: Kept Tailwind layout so it looks good.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, IdCard } from "lucide-react";

export type LoginFormValues = {
  nationalId: string; // CHANGED
  email: string;
  password: string;
};

export default function LoginForm(props: {
  onSubmit: (v: LoginFormValues) => void | Promise<void>;
}) {
  const { onSubmit } = props;

  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ nationalId, email, password }); // CHANGED
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your healthcare portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* National ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              National ID
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                inputMode="numeric"
                pattern="\d{10}"          // optional: 10 digits
                minLength={10}
                maxLength={10}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="10-digit National ID"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full py-3 rounded-lg shadow-sm text-sm font-medium bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
