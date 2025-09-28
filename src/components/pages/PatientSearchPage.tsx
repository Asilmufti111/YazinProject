import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../../types';
import { supabase } from '../../lib/supabaseClient';

const PatientSearchPage: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [mrn, setMrn] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [allPatients, setAllPatients] = useState<SearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const navigate = useNavigate();

  // ✅ Fetch all patients on first load
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      const results: SearchResult[] = (data || []).map((patient) => ({
        id: patient.id,
        mrn: patient.mrn || patient.id.slice(0, 5).toUpperCase(),
        name: patient.name,
        hospital: patient.hospital,
        dob: patient.date_of_birth,
      }));

      setAllPatients(results);
      setSearchResults(results); // Show all by default
    };

    fetchPatients();
  }, []);

  // ✅ Search handler
const handleSearch = () => {
  const filtered = allPatients.filter((patient) => {
    const matchesId = patientId
      ? patient.id.toLowerCase().includes(patientId.toLowerCase())
      : true;

    const matchesMrn = mrn
      ? patient.mrn.toLowerCase().includes(mrn.toLowerCase())
      : true;

    const matchesHospital = hospitalName
      ? patient.hospital.toLowerCase().includes(hospitalName.toLowerCase())
      : true;

    return matchesId && matchesMrn && matchesHospital;
  });

  setSearchResults(filtered);
};


  const handleSelectPatient = (patientId: string) => {
    navigate(`/dashboard/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Patient</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MRN</label>
            <input
              type="text"
              value={mrn}
              onChange={(e) => setMrn(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Results:</h2>
            <ul className="space-y-4">
              {searchResults.map((patient) => (
                <li
                  key={patient.id}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  <div className="font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-600">Patient ID: {patient.id}</div>
                  <div className="text-sm text-gray-600">MRN: {patient.mrn}</div>
                  <div className="text-sm text-gray-600">Hospital: {patient.hospital}</div>
                  <div className="text-sm text-gray-600">DOB: {patient.dob}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchResults.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientSearchPage;
