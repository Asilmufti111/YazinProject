// /src/components/auth/SignupForm.tsx
// CHANGED: Tailwind-styled card layout (to match your Login page)
// CHANGED: Kept your field names so App.tsx continues to work
// CHANGED: Added simple client-side validation hints (national ID)

import React, { useState } from "react";
import { User as UserIcon, Mail, Lock, Building2 as Hospital, Shield } from "lucide-react";
import type { Role } from "../../types";
import { ROLE_OPTIONS } from "../../types";
export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  role: Role;
  hospitalName: string;
  nationalId: string;
};

export default function SignupForm(props: { onSubmit: (v: SignupFormValues) => Promise<void> | void }) {
  const { onSubmit } = props;

  const [values, setValues] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: "",
    role: "doctor",
    hospitalName: "",
    nationalId: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null); // CHANGED: small error surface

  const update =
    (k: keyof SignupFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    // CHANGED: tiny guard for National ID length (you can remove/adjust)
    if (!/^\d{10}$/.test(values.nationalId)) {
      setErr("National ID must be 10 digits.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (e: any) {
      setErr(e?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // CHANGED: full-page gradient + centered card
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {err && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="text"
                placeholder="Your name"
                value={values.name}
                onChange={update("name")}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={update("email")}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={values.password}
                onChange={update("password")}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={values.role}
                onChange={update("role")}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
               {ROLE_OPTIONS.map((r) => (
        <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>
))}
              </select>
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization name</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hospital className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="text"
                placeholder="Hospital / Company / Institution"
                value={values.hospitalName}
                onChange={update("hospitalName")}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* National ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <div className="mt-1 relative">
              <input
                required
                inputMode="numeric"
                pattern="\d{10}"
                title="10 digits"
                placeholder="10 digits"
                value={values.nationalId}
                onChange={update("nationalId")}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          
        </form>
      </div>
    </div>
  );
}
