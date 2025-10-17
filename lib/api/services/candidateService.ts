/**
 * Candidate API service
 */

import { api, uploadFile } from '../client';
import type { Candidate, CandidateUploadResponse, CandidateListResponse } from '@/lib/types/candidate';

export async function uploadResume(
  file: File,
  model: string = 'openai-gpt-4o'
): Promise<CandidateUploadResponse> {
  return uploadFile<CandidateUploadResponse>(
    '/api/v1/candidates/upload',
    file,
    { model }
  );
}

export async function getCandidates(
  page: number = 1,
  pageSize: number = 100
): Promise<CandidateListResponse> {
  const skip = (page - 1) * pageSize;
  return api.get<CandidateListResponse>('/api/v1/candidates', {
    params: { skip, limit: pageSize },
  });
}

export async function getCandidateById(candidateId: string): Promise<Candidate> {
  return api.get<Candidate>(`/api/v1/candidates/${candidateId}`);
}

export async function deleteCandidate(candidateId: string): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(`/api/v1/candidates/${candidateId}`);
}
