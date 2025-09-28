import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Patient, Medication } from '../../types';
import {
    CheckCircle, Clock, PauseCircle, Pencil, XCircle, PlayCircle,
} from 'lucide-react';

interface Props {
    selectedTab: 'active' | 'suspended' | 'history';
    setSelectedTab: React.Dispatch<React.SetStateAction<'active' | 'suspended' | 'history'>>;
    patient: Patient;
    formatDate: (dateString: string) => string;
}
// interface Props {
//     selectedTab: 'active' | 'suspended' | 'history';
//     setSelectedTab: Dispatch<SetStateAction<'active' | 'suspended' | 'history'>>;
//     patient: Patient;
//     formatDate: (dateString: string) => string;
// }

const calculateDurationInDays = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
};

const MedicationsSection: React.FC<Props> = ({
    selectedTab,
    setSelectedTab,
    patient,
    formatDate,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    const [editValues, setEditValues] = useState<{ dosage: string; durationDays: number }>({
        dosage: '',
        durationDays: 0,
    });
    const [showSubmitPanel, setShowSubmitPanel] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [submitMrn, setSubmitMrn] = useState('');
    const [submitHospital, setSubmitHospital] = useState('');
    const hospitals = ['City Hospital', 'County General', 'Metro Clinic'];

    useEffect(() => {
        const fetchMedications = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('medications')
                .select(`
    *,
    prescribed_by_user:users(name)
  `)
                .eq('patient_id', patient.id);

            if (error) {
                console.error('Error fetching medications:', error);
            } else {
                setMedications(data as Medication[]);
            }
            setLoading(false);
        };

        fetchMedications();

    }, [patient.id]);


    const handleModify = (med: Medication) => {
        const durationDays = calculateDurationInDays(med.start_date, med.end_date); // ✅ Declare it here

        setEditingId(med.id);
        setEditValues({
            dosage: med.dosage,
            durationDays,
        });
    };

    const handleSave = async (id: string) => {
        console.log('Save changes for', id, editValues);

        // 1. Update the DB
        const { error } = await supabase
            .from("medications")
            .update({
                dosage: editValues.dosage,
                duration_days: editValues.durationDays,
            })
            .eq("id", id);

        if (error) {
            console.error("Error updating medication:", error);
            return;
        }

        // 2. Fetch the updated medication from DB
        const { data: updatedMed, error: fetchError } = await supabase
            .from("medications")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError) {
            console.error("Error fetching updated medication:", fetchError);
            return;
        }

        // 3. Update local state
        setMedications((prev) =>
            prev.map((med) =>
                med.id === id ? { ...med, ...updatedMed } : med
            )
        );

        // 4. Exit edit mode
        setEditingId(null);
    };



    const handleAction = async (action: string, med: Medication) => {
        let newStatus: 'active' | 'inactive' | 'suspended';

        switch (action) {
            case 'continue':
                newStatus = 'active';
                break;
            case 'discontinue':
                newStatus = 'inactive';
                break;
            case 'suspend':
                newStatus = 'suspended';
                break;
            default:
                console.warn(`Unknown action: ${action}`);
                return;
        }

        // ✅ Update in Supabase
        const { error } = await supabase
            .from("medications")
            .update({ status: newStatus })
            .eq("id", med.id);

        if (error) {
            console.error("Error updating medication status:", error);
            return;
        }

        console.log(`Medication ${med.name} updated to ${newStatus}`);

        // ✅ Update local state so UI reflects change immediately
        setMedications((prev) =>
            prev.map((m) =>
                m.id === med.id ? { ...m, status: newStatus } : m
            )
        );
    };


    const renderMedicationList = (medications: Medication[] = [], title: string) => {
        if (medications.length === 0) {
            return <p className="text-gray-500">{title} - No medications found.</p>;
        }

        return (
            <>
                {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3> */}
                {medications.map((med) => (
                    <div key={med.id} className="border-b border-gray-100 pb-4 mb-4 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{med.name}</h4>
                                {editingId === med.id ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                            <div className="flex flex-col">

                                                <label className="text-sm text-gray-700 mb-1"> Dosage</label>

                                                <input
                                                    type="text"
                                                    value={editValues.dosage}
                                                    onChange={(e) =>
                                                        setEditValues({ ...editValues, dosage: e.target.value })
                                                    }
                                                    className="border px-2 py-1 rounded"
                                                    placeholder="Dosage"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text-sm text-gray-700 mb-1"> Duration (days)</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={editValues.durationDays}
                                                    onChange={(e) =>
                                                        setEditValues({ ...editValues, durationDays: parseInt(e.target.value) || 0 })
                                                    }
                                                    className="border px-2 py-1 rounded"
                                                    placeholder="Enter number of days"
                                                />
                                            </div>


                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleSave(med.id)}
                                                className="text-sm px-3 py-1 bg-green-500 text-white rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Dosage: </strong>  {med.dosage} - <strong>Frequency: </strong> {med.frequency}
                                        </p>
                                        <p className="text-sm text-gray-600"><strong>Route: </strong> {med.route}</p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Indication:</strong> {med.indications || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Duration: </strong> {med.duration_days} days
                                        </p>

                                        <div className="text-sm text-gray-600 mt-1">
                                            <strong>Prescription Period: </strong>
                                            {formatDate(med.start_date)}
                                            {med.end_date && ` - ${formatDate(med.end_date)}`}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="text-right text-sm text-gray-500 min-w-[150px]">
                                Prescribed by: {med.prescribed_by_user?.name || 'Unknown'}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={() => handleAction('continue', med)}
                                className="flex items-center gap-1 text-sm px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                            >
                                <PlayCircle className="w-4 h-4" />
                                Continue
                            </button>
                            <button
                                onClick={() => handleAction('discontinue', med)}
                                className="flex items-center gap-1 text-sm px-2 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                            >
                                <XCircle className="w-4 h-4" />
                                Discontinue
                            </button>
                            <button
                                onClick={() => handleAction('suspend', med)}
                                className="flex items-center gap-1 text-sm px-2 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-50"
                            >
                                <PauseCircle className="w-4 h-4" />
                                Suspend
                            </button>
                            <button
                                onClick={() => handleModify(med)}
                                className="flex items-center gap-1 text-sm px-2 py-1 border border-gray-500 text-gray-700 rounded hover:bg-gray-100"
                            >
                                <Pencil className="w-4 h-4" />
                                Modify
                            </button>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const activeMeds = medications.filter((m) => m.status === 'active' || !m.status);
    const suspendedMeds = medications.filter((m) => m.status === 'suspended');
    const historyMeds = medications.filter((m) => m.status === 'inactive');


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {loading && <p className="p-6 text-gray-500">Loading medications...</p>}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Medications</h2>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100">
                <div className="flex">
                    {(['active', 'suspended', 'history'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 px-6 py-3 text-sm font-medium capitalize ${selectedTab === tab
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {tab === 'active' && <CheckCircle className="h-4 w-4" />}
                                {tab === 'suspended' && <PauseCircle className="h-4 w-4" />}
                                {tab === 'history' && <Clock className="h-4 w-4" />}
                                {tab} Medications
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {selectedTab === 'active' && renderMedicationList(activeMeds, 'Active Medications')}
                {selectedTab === 'suspended' && renderMedicationList(suspendedMeds, 'Suspended Medications')}
                {selectedTab === 'history' && renderMedicationList(historyMeds, 'Medication History')}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end px-6 pb-6">
                {showSuccess && (
                    <div className="text-green-600 text-lg mr-auto">
                        Prescription submitted successfully!
                    </div>
                )}
                <button
                    onClick={() => setShowSubmitPanel(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>

            {/* Submit Panel */}
            {showSubmitPanel && (
                <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Submit Prescription</h3>

                    <label className="block text-sm font-medium text-gray-700">MRN Number</label>
                    <input
                        type="text"
                        value={submitMrn}
                        onChange={(e) => setSubmitMrn(e.target.value)}
                        className="mt-1 mb-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter MRN"
                    />

                    <label className="block text-sm font-medium text-gray-700">Select Hospital</label>
                    <select
                        value={submitHospital}
                        onChange={(e) => setSubmitHospital(e.target.value)}
                        className="mt-1 mb-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select Hospital</option>
                        {hospitals.map((h, idx) => (
                            <option key={idx} value={h}>
                                {h}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowSubmitPanel(false)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!submitMrn || !submitHospital) {
                                    alert('Please enter MRN and select a hospital.');
                                    return;
                                }

                                console.log('Submitted MRN:', submitMrn);
                                console.log('Submitted Hospital:', submitHospital);

                                setShowSubmitPanel(false); // Close the panel
                                setShowSuccess(true); // Show success message

                                // Optionally, hide success after a few seconds
                                setTimeout(() => {
                                    setShowSuccess(false);
                                }, 3000);
                            }}

                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MedicationsSection;
