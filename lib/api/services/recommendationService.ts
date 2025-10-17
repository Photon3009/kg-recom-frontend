/**
 * Recommendation API service
 */

import { api } from '../client';
import type {
  JobRecommendationResponse,
  CandidateRecommendationResponse,
  RecommendationStats,
} from '@/lib/types/recommendation';

export async function getJobRecommendations(
  candidateId: string,
  topK: number = 10,
  minScore: number = 0.3
): Promise<JobRecommendationResponse> {
  return api.get<JobRecommendationResponse>(
    `/api/v1/recommendations/jobs/${candidateId}`,
    {
      params: { top_k: topK, min_score: minScore },
    }
  );
}

export async function getCandidateRecommendations(
  jobId: string,
  topK: number = 10,
  minScore: number = 0.3
): Promise<CandidateRecommendationResponse> {
  return api.get<CandidateRecommendationResponse>(
    `/api/v1/recommendations/candidates/${jobId}`,
    {
      params: { top_k: topK, min_score: minScore },
    }
  );
}

export async function getRecommendationStats(): Promise<RecommendationStats> {
  return api.get<RecommendationStats>('/api/v1/recommendations/stats');
}
