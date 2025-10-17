export interface JobDescriptionTextRequest {
  job_description_text: string;
  model?: string;
  top_k?: number;
  min_score?: number;
  include_location_score?: boolean;
}

export interface CandidateRecommendation {
  candidate_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  current_role: string | null;
  location: string;
  total_experience: string;
  overall_score: number;
  match_percentage: string;
  matched_skills: string[];
  matched_must_have_skills?: string[];
  matched_optional_skills?: string[];
  additional_skills: string[];
  missing_skills?: string[];
  skill_match_count: string;
  skill_match_score: number;
  experience_match: boolean;
  experience_match_score: number;
  location_match: boolean;
  location_match_score: number;

  // Context from KG
  companies?: string[];
  institutions?: string[];
  job_roles?: string[];
  reasons?: string[];

  // Knowledge Graph Relationship Scores
  company_network_score?: number;
  institution_network_score?: number;
  industry_cluster_score?: number;
  local_network_score?: number;
  role_progression_score?: number;
  kg_relationship_bonus?: number;
  kg_bonus?: number;
  kg_reasoning?: string[];
  base_score?: number;
}

export interface JobMatchingResponse {
  job_id: string;
  job_title: string;
  total_recommendations: number;
  recommendations: CandidateRecommendation[];
  avg_match_score: number;
  top_matched_skills: string[];
}
