// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"; // CHANGED: no BrowserRouter here

import { supabase } from "./lib/supabaseClient";
import Header from "./components/Header";
import LoginForm, { type LoginFormValues } from "./components/auth/LoginForm";
import SignupForm, { type SignupFormValues } from  "./components/auth/SignupForm";
import PatientSearchPage from "./components/pages/PatientSearchPage";
import { PatientDashboard } from "./components/dashboard/PatientDashboard";

import { useAuth } from "./hooks/useAuth";
import type { User, Patient } from "./types";

/* Login wrapper */
const LoginFormWrapper: React.FC<{ setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ setUser }) => {
  const navigate = useNavigate();

const handleLogin = async ({nationalId, email, password }: LoginFormValues) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
    return;
  }

  const u = data.user!;
  // Look up the profile row — this is the “login based on users table” check
  const { data: profile, error: profErr } = await supabase
    .from("users")
    .select("id, name, role, hospital, national_id")
    .eq("id", u.id) // or .eq("auth_user_id", u.id) if that’s your schema
    .maybeSingle();

  if (profErr) {
    alert(`Could not read profile: ${profErr.message}`);
    await supabase.auth.signOut();
    return;
  }

  if (!profile) {
    // No row in public.users → treat as invalid login for your app
    alert("No profile found in the users table. Contact support or sign up again.");
    await supabase.auth.signOut();
    return;
  }
if (!profile.national_id || profile.national_id !== nationalId) {
      alert("National ID does not match this account.");
      await supabase.auth.signOut();
      return;
    }

  // OK: trust DB values
  setUser({
    id: u.id,
    email: u.email!,
    name: profile.name || "",
    // role: profile.role, // if your User type has it
  });

  navigate("/search");
};

  return <LoginForm onSubmit={handleLogin} />;   // ← onSubmit (not onLogin)
};


/* Signup wrapper */
const SignupWrapper: React.FC<{ setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ setUser }) => {
  const navigate = useNavigate();

  // --- inside SignupWrapper ---
const onSignup = async ({ name, email, password, role, hospitalName, nationalId }: SignupFormValues) => {
  // 1) Create auth user and send metadata for the trigger
  const { error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 👇 keys must match what your trigger expects
      data: {
        full_name: name,
        role,                         // e.g. "doctor" | "pharmacist" | ...
        hospital: hospitalName,       // your column is `hospital`
        national_id: nationalId,      // your column is `national_id`
      },
      // optional, if you use email confirmations:
      // emailRedirectTo: window.location.origin,
    },
  });

  if (signUpErr) {
    alert(signUpErr.message);
    return;
  }

  // 2) No client-side insert. The trigger will insert into public.users.
  // 3) Send user to the Login page
  navigate("/");                      // <- go to login after creating account
};

  return <SignupForm onSubmit={onSignup} />;
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
        diagnoses: [],
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
   App
   ========================= */
export default function App() {
  const { user, setUser } = useAuth();

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<LoginFormWrapper setUser={setUser} />} />
        <Route path="/signup" element={<SignupWrapper setUser={setUser} />} />
        <Route path="/search" element={user ? <PatientSearchPage /> : <Navigate to="/" replace />} />
        <Route path="/dashboard/:patientId" element={user ? <DashboardLayout /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}