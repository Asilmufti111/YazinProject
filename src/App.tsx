// src/App.tsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { supabase } from './lib/supabaseClient';
import { LoginForm } from './components/auth/LoginForm';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import PatientSearchPage from './components/pages/PatientSearchPage';

import type { User, Patient } from './types';

// ⛳ Login Wrapper Component
const LoginFormWrapper: React.FC<{ setUser: React.Dispatch<React.SetStateAction<User | null>> }> = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    const user = data.user;
    if (user) {
      setUser({ id: user.id, email: user.email! });
      navigate('/search');
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

// ⛳ Dashboard Layout (fetches patient and renders dashboard)
const DashboardLayout: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        return;
      }

      if (data) {
        const p: Patient = {
          id: data.id,
          name: data.name,
          date_of_birth: data.date_of_birth,
          bloodType: data.blood_type,
          allergies: [],
          vitalSigns: {
            temperature: 0,
            bloodPressure: '',
            heartRate: 0,
            oxygenSaturation: 0,
          },
          medications: [],
          medicationHistory: [],
          suspendedMedications: [],
          // chiefComplaint: null,
        };

        setPatient(p);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (!patient) return <div>Loading patient...</div>;

  return <PatientDashboard patient={patient} />;
};

// ⛳ Main App Component
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restore = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        setUser({ id: u.id, email: u.email! });
      }
    };
    restore();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <LoginFormWrapper setUser={setUser} />}
        />
        <Route
          path="/search"
          element={user ? <PatientSearchPage /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/:patientId"
          element={user ? <DashboardLayout /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
