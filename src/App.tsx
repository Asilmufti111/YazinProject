// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"; // CHANGED: no BrowserRouter here

import { supabase } from "./lib/supabaseClient";
import Header from "./components/Header";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm, type SignupPayload } from "./components/auth/SignupForm"; // NEW: import SignupForm
import PatientSearchPage from "./components/pages/PatientSearchPage";
import { PatientDashboard } from "./components/dashboard/PatientDashboard";

import { useAuth } from "./hooks/useAuth";
import type { User, Patient } from "./types";

/* =========================
   Login wrapper (handles Supabase auth)
   ========================= */
const LoginFormWrapper: React.FC<{ setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogin = async ({
    email,
    password,
    hospital, // CHANGED: accept hospital because LoginForm sends it
  }: {
    email: string;
    password: string;
    hospital: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    const u = data.user!;
    // Optional: verify hospital membership here (profiles/hospitals check)

    setUser({
      id: u.id,
      email: u.email!,
      name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || "",
    }); // CHANGED: set name for header display
    navigate("/search");
  };

  return <LoginForm onLogin={handleLogin} />;
};

/* =========================
   Signup wrapper (same pattern as login)
   ========================= */
const SignupWrapper: React.FC<{ setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ setUser }) => {
  const navigate = useNavigate();

  const onSignup = async ({ name, email, password, role, hospitalCode }: SignupPayload) => {
    // 1) Create auth user (store display name in metadata)
    const { data: su, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    });
    if (signUpErr) {
      alert(signUpErr.message);
      return;
    }

    // 2) Optional: map hospitalCode -> hospital_id, upsert profiles row here

    // 3) Auto-login (works if email confirmation is OFF)
    const { data: li, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
    if (loginErr) {
      alert("Sign-up succeeded. Please verify your email, then sign in.");
      return;
    }

    const u = li.user!;
    setUser({
      id: u.id,
      email: u.email!,
      name: (u.user_metadata?.full_name as string) || name,
    }); // CHANGED: set name so header shows user name
    navigate("/search");
  };

  return <SignupForm onSignup={onSignup} />;
};

/* =========================
   Dashboard loader
   ========================= */
const DashboardLayout: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = React.useState<Patient | null>(null);

  React.useEffect(() => {
    if (!patientId) return;

    (async () => {
      const { data, error } = await supabase.from("patients").select("*").eq("id", patientId).single();
      if (error || !data) return;

      const p: Patient = {
        id: data.id,
        name: data.name,
        date_of_birth: data.date_of_birth,
        bloodType: data.blood_type,
        allergies: [],
        diagnoses: [], // CHANGED: keep diagnoses array as in your types
        vitalSigns: { temperature: 0, bloodPressure: "", heartRate: 0, oxygenSaturation: 0 },
        medications: [],
        medicationHistory: [],
        suspendedMedications: [],
      };
      setPatient(p);
    })();
  }, [patientId]);

  if (!patient) return <div>Loading patient...</div>;
  return <PatientDashboard patient={patient} />;
};

/* =========================
   App (no BrowserRouter here)
   ========================= */
export default function App() {
  const { user, setUser } = useAuth();

  // CHANGED: logout for header
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      {/* CHANGED: header shows logo + user name + logout */}
      <Header user={user} onLogout={logout} />

      {/* Routes only; BrowserRouter must be in src/main.tsx */}
      <Routes>
        <Route path="/" element={<LoginFormWrapper setUser={setUser} />} />
        <Route path="/signup" element={<SignupWrapper setUser={setUser} />} /> {/* NEW: signup route */}
        <Route path="/search" element={user ? <PatientSearchPage /> : <Navigate to="/" replace />} />
        <Route path="/dashboard/:patientId" element={user ? <DashboardLayout /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* NEW: catch-all to avoid blank pages */}
      </Routes>
    </>
  );
}
