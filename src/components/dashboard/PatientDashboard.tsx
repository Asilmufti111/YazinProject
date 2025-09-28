import React, { useState, useEffect } from 'react';
import type { Patient, Diagnosis } from '../../types';
import { supabase } from '../../lib/supabaseClient'; // adjust path if needed
import VitalSignsSummary from './VitalSignsSummary';
// import ChiefComplaintSection from './ChiefComplaintSection';
import MedicationsSection from './MedicationsSection';
// import ClinicalNotesSection from './ClinicalNotesSection';
import SidebarPanel from './SidebarPanel';


import { Link } from 'react-router-dom';

interface PatientDashboardProps {
  patient: Patient;
}


export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [selectedTab, setSelectedTab] = useState<'active' | 'history' | 'suspended'>('active');
  //  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  // const [showEditComplaint, setShowEditComplaint] = useState(false);
  // const [editedComplaint, setEditedComplaint] = useState<ChiefComplaint | null>(patient.chiefComplaint || null);
  const [vitalSigns, setVitalSigns] = useState<Patient['vitalSigns']>({
    temperature: 0,
    bloodPressure: '',
    heartRate: 0,
    oxygenSaturation: 0
  });

  //  const [newNote, setNewNote] = useState({
  //   content: '',
  //   category: 'General' as ClinicalNote['category'],
  //   priority: 'Low' as ClinicalNote['priority']
  // });
  useEffect(() => {
    const fetchVitalSigns = async () => {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patient.id)
        .order('recorded_at', { ascending: false }) // latest record first
        .limit(1);

      if (error) {
        console.error('Error fetching vital signs:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const vs = data[0];
        setVitalSigns({
          temperature: vs.temperature,
          bloodPressure: vs.blood_pressure,
          heartRate: vs.heart_rate,
          oxygenSaturation: vs.oxygen_saturation
        });
      }
    };

    fetchVitalSigns();
  }, [patient.id]);
  const [allergies, setAllergies] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllergies = async () => {
      const { data, error } = await supabase
        .from('allergies')
        .select('allergy')
        .eq('patient_id', patient.id);

      if (error) {
        console.error('Error:', error);
      } else {
        setAllergies(data.map((a) => a.allergy));
      }
    };

    fetchAllergies();
  }, [patient.id]);


  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('patient_id', patient.id)
        .order('diagnosed_at', { ascending: false });

      if (error) {
        console.error('Error fetching diagnoses:', error.message);
      } else {
        setDiagnoses(data || []);
      }
    };

    fetchDiagnoses();
  }, [patient.id]);


  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Yazin</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Dr. Smith</span>
              <Link to="/">
                <button
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-600">Patient ID: {patient.id}</p>
        </div>

        <VitalSignsSummary vitalSigns={vitalSigns} />

        {/* Sidebar */}
        <SidebarPanel allergies={allergies} diagnoses={diagnoses} />

        {/* Medications Section */}
<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
          <MedicationsSection
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            patient={patient}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
    // </div>

  );
};
