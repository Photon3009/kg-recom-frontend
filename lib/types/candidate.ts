/**
 * TypeScript types for Candidate-related entities
 */

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  current_role?: string;
  total_experience: string;
  summary?: string;
  status: string;
  skills: string[];
  experience?: WorkExperience[];
  education?: Education[];
  certifications?: string[];
  languages?: string[];
  created_at: string;
  updated_at?: string;
  node_count?: number;
  relationship_count?: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
  field_of_study?: string;
}

export interface CandidateUploadResponse {
  success: boolean;
  message: string;
  data: {
    candidate_id: string;
    name: string;
    location: string;
    skills: string[];
    status: string;
    processing_time: number;
  };
}

export interface CandidateListResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  page_size: number;
}
