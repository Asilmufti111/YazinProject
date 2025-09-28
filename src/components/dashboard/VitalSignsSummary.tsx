// src/components/dashboard/VitalSignsSummary.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import type { Patient } from '../../types';

interface Props {
  vitalSigns: Patient['vitalSigns'];
}

const VitalSignsSummary: React.FC<Props> = ({ vitalSigns }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[
      { label: 'Temperature', value: `${vitalSigns.temperature}°C` },
      { label: 'Blood Pressure', value: vitalSigns.bloodPressure },
      { label: 'Heart Rate', value: `${vitalSigns.heartRate} BPM` },
      { label: 'O2 Saturation', value: `${vitalSigns.oxygenSaturation}%` }
    ].map((item, idx) => (
      <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
          <Activity className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
      </div>
    ))}
  </div>
);

export default VitalSignsSummary;
