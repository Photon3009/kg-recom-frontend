/**
 * TypeScript types for Job-related entities
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience_required: string;
  salary?: string;
  job_type?: string;
  description: string;
  status: string;
  skills: string[];
  created_at: string;
  updated_at?: string;
  node_count?: number;
  relationship_count?: number;
  education_required?: string;
  responsibilities?: string[];
  benefits?: string[];
}

export interface JobCreate {
  title: string;
  company: string;
  location: string;
  experience_required: string;
  description: string;
  skills: string[];
  job_type?: string;
  salary?: string;
  education_required?: string;
  responsibilities?: string[];
  benefits?: string[];
  model?: string;
}

export interface JobUploadResponse {
  success: boolean;
  message: string;
  data: {
    job_id: string;
    title: string;
    company: string;
    location: string;
    skills: string[];
    status: string;
    processing_time: number;
    node_count: number;
    relationship_count: number;
  };
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  page_size: number;
}
