/**
 * Job API service
 */

import { api, uploadFile } from '../client';
import type { Job, JobUploadResponse, JobListResponse } from '@/lib/types/job';

export async function uploadJobDescription(
  file: File,
  model: string = 'openai-gpt-4o'
): Promise<JobUploadResponse> {
  return uploadFile<JobUploadResponse>(
    '/api/v1/jobs/upload',
    file,
    { model }
  );
}

export async function getJobs(
  page: number = 1,
  pageSize: number = 100
): Promise<JobListResponse> {
  const skip = (page - 1) * pageSize;
  return api.get<JobListResponse>('/api/v1/jobs', {
    params: { skip, limit: pageSize },
  });
}

export async function getJobById(jobId: string): Promise<Job> {
  return api.get<Job>(`/api/v1/jobs/${jobId}`);
}

export async function deleteJob(jobId: string): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(`/api/v1/jobs/${jobId}`);
}
