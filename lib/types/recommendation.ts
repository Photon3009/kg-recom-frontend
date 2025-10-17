/**
 * TypeScript types for Recommendation-related entities
 */

export interface JobRecommendation {
  job_id: string;
  title: string;
  company: string;
  location: string;
  experience_required: string;
  salary?: string;
  job_type?: string;
  description?: string;
  created_at?: string;

  // Match details
  overall_score: number;
  match_percentage: string;

  // Skill matching
  matched_skills: string[];
  missing_skills: string[];
  skill_match_count: string;
  skill_match_score: number;

  // Experience matching
  experience_match: boolean;
  experience_match_score: number;
  experience_gap?: string;

  // Location matching
  location_match: boolean;
  location_match_score: number;
}

export interface CandidateRecommendation {
  candidate_id: string;
  name: string;
  current_role?: string;
  location: string;
  total_experience: string;
  email?: string;

  // Match details
  overall_score: number;
  match_percentage: string;

  // Skill matching
  matched_skills: string[];
  additional_skills: string[];
  skill_match_count: string;
  skill_match_score: number;

  // Experience matching
  experience_match: boolean;
  experience_match_score: number;

  // Location matching
  location_match: boolean;
  location_match_score: number;
}

export interface JobRecommendationResponse {
  candidate_id: string;
  candidate_name: string;
  total_recommendations: number;
  recommendations: JobRecommendation[];
  avg_match_score: number;
  top_matched_skills: string[];
  common_missing_skills: string[];
}

export interface CandidateRecommendationResponse {
  job_id: string;
  job_title: string;
  total_recommendations: number;
  recommendations: CandidateRecommendation[];
  avg_match_score: number;
  top_matched_skills: string[];
}

export interface RecommendationStats {
  total_jobs: number;
  total_candidates: number;
  total_skills: number;
  avg_skills_per_job: number;
  avg_skills_per_candidate: number;
  top_demanded_skills: Array<{ skill: string; count: number }>;
  top_locations: Array<{ location: string; count: number }>;
}
