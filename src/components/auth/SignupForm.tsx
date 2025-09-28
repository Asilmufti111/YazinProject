import React, { useState } from "react";
import { User as UserIcon, Mail, Lock, Building2 as Hospital, Shield } from "lucide-react";

export type Role = "doctor" | "pharmacist" | "admin" | "insurance";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
  hospitalCode: string;
};

export const SignupForm: React.FC<{
  onSignup: (c: SignupPayload) => Promise<void> | void;
}> = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [hospitalCode, setHospitalCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name || !hospitalCode) return setErr("Enter name and hospital code.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await onSignup({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        hospitalCode: hospitalCode.trim().toUpperCase(),
      });
    } catch (e: any) {
      setErr(e?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-600 mt-2">Join your hospital workspace</p>
        </div>

        {err && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital ID</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hospital className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={hospitalCode}
                onChange={(e) => setHospitalCode(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                placeholder="e.g., KFHJ"
                pattern="[A-Za-z0-9\-]{2,12}"
                autoComplete="organization"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Min 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating your account…" : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};
