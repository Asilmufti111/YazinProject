import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DrugInteraction {
  severity: 'high' | 'medium' | 'low';
  description: string;
}

interface DrugSuggestion {
  name: string;
  dosage: string;
  frequency: string;
  confidence: number;
  tags: string[];
  reason: string;
}

export const SmartPrescription: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const mockInteractions: DrugInteraction[] = [
    {
      severity: 'high',
      description: 'Potential severe interaction with current blood pressure medication'
    },
    {
      severity: 'medium',
      description: 'May cause drowsiness when combined with current sleep medication'
    }
  ];

  const mockSuggestions: DrugSuggestion[] = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      confidence: 92,
      tags: ['Elderly Safe', 'Renal Adjusted'],
      reason: 'Effective blood pressure control with low interaction risk'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      confidence: 89,
      tags: ['Diabetic Care', 'Pregnancy Caution'],
      reason: 'Improves glycemic control and supports weight management'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          AI-Powered Smart Prescription Assistant
        </h2>

        <div className="space-y-6">
          {/* Interactions Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Drug Interaction Alerts</h3>
            <div className="space-y-3">
              {mockInteractions.map((interaction, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    interaction.severity === 'high'
                      ? 'bg-red-50'
                      : interaction.severity === 'medium'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <AlertCircle
                    className={`h-5 w-5 ${
                      interaction.severity === 'high'
                        ? 'text-red-500'
                        : interaction.severity === 'medium'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {interaction.severity.toUpperCase()} Risk
                    </p>
                    <p className="text-sm text-gray-600">{interaction.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Medications</h3>
            <div className="space-y-3">
              {mockSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 text-lg">{suggestion.name}</p>
                    <p className="text-sm text-gray-700">
                      <strong>Dosage:</strong> {suggestion.dosage} | <strong>Frequency:</strong>{' '}
                      {suggestion.frequency}
                    </p>
                    <p className="text-sm text-gray-600 italic">{suggestion.reason}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Confidence:</strong> {suggestion.confidence}% |{' '}
                      <strong>Tags:</strong> {suggestion.tags.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Confirm Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
