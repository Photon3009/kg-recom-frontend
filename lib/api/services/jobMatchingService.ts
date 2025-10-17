import { api } from '../client';
import type { JobDescriptionTextRequest, JobMatchingResponse } from '@/lib/types/jobMatching';

export async function getCandidatesForJDText(
  jobDescriptionText: string,
  topK: number = 10,
  minScore: number = 0.3,
  includeLocationScore: boolean = true,
  model: string = 'openai-gpt-4o'
): Promise<JobMatchingResponse> {
  const requestData: JobDescriptionTextRequest = {
    job_description_text: jobDescriptionText,
    model,
    top_k: topK,
    min_score: minScore,
    include_location_score: includeLocationScore,
  };

  return api.post<JobMatchingResponse>(
    '/api/v1/recommendations/candidates-by-jd-text',
    requestData
  );
}
