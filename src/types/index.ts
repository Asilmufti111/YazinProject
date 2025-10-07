// src/types.ts
export type Role = "doctor" | "pharmacist" | "admin" | "insurance"; // NEW

// NEW: handy list for rendering <select> options, if you want
export const ROLE_OPTIONS: Role[] = ["doctor", "pharmacist", "admin", "insurance"]; // NEW

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: Role;        // NEW: optional role on the in-app user object
  hospital?: string;  // NEW: optional hospital/org name
  nationalId?: string; // NEW: optional national ID (if you want to cache it client-side)
}


// export interface ChiefComplaint {
//   id: string;
//   description: string;
//   onsetDate: string;
//   severity: 'Mild' | 'Moderate' | 'Severe';
//   symptoms: string[];
//   lastUpdated: string;
//   updatedBy: string;
// }

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
 start_date: string;
  end_date?: string;
  duration_days: number;
  status?: 'active' | 'inactive' | 'suspended';
  discontinuationReason?: string;
  prescribed_by:string;
  route: 'Oral' | 'Injection' | 'Topical' | 'IV' | 'Inhalation' | 'Other';
  prescribed_by_user?: {
    name: string;
  };
    indications?: string; // ← Add this line

}

export interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
}

export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  bloodType?: string;
  allergies: string[];
  diagnoses:string[];
  vitalSigns: VitalSigns;
  medications: Medication[];
  medicationHistory: Medication[];
  suspendedMedications: Medication[];
  // chiefComplaint: ChiefComplaint | null;
}

export interface SearchResult {
  id: string;
  mrn: string;
  name: string;
  hospital: string;
  dob: string;
}

export interface Diagnosis {
  diagnosis: string;
  diagnosed_at: string;
}