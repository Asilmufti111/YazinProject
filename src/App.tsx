// src/App.tsx
import React from 'react';
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
import { useAuth } from './hooks/useAuth';

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

// ⛳ Dashboard Layout
const DashboardLayout: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = React.useState<Patient | null>(null);

  React.useEffect(() => {
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
          diagnoses: []
        };

        setPatient(p);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (!patient) return <div>Loading patient...</div>;

  return <PatientDashboard patient={patient} />;
};

// ⛳ Main App
const App: React.FC = () => {
  const { user, setUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginFormWrapper setUser={setUser} />} />
        <Route path="/search" element={user ? <PatientSearchPage /> : <Navigate to="/" />} />
        <Route path="/dashboard/:patientId" element={user ? <DashboardLayout /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
