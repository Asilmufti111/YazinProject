import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import type { Diagnosis } from '../../types';


interface Props {
  allergies: string[];
diagnoses: Diagnosis[];
}


const SidebarPanel: React.FC<Props> = ({ allergies , diagnoses }) => {
  return (
<div className="flex flex-col md:flex-row w-full gap-6">
      
      {/* Allergies Panel */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Allergies</h2>
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="space-y-2">
          {allergies.length > 0 ? (
            allergies.map((allergy, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-700 bg-red-50 p-2 rounded"
              >
                <span>{allergy}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No known allergies.</p>
          )}
        </div>
      </div>

    {/* Medical History Panel */}
<div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900">Medical History/ Diagnosis</h2>
    <FileText className="h-5 w-5 text-blue-500" />
  </div>

  <div className="space-y-2">
    {diagnoses.length > 0 ? (
      diagnoses.map((diagnosis , index) => (
        <div
          key={index}
          className="flex flex-col text-sm text-gray-700 bg-blue-50 p-2 rounded"
        >
          <span className="font-medium">{diagnosis.diagnosis}</span>

<span className="text-xs text-gray-400">
  Diagnosed on: {new Date(diagnosis.diagnosed_at).toLocaleDateString()}
</span>


        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No medical history recorded.</p>
    )}
  </div>
</div>
</div>
  );
};

export default SidebarPanel;
