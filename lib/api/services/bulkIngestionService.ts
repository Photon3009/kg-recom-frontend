import { apiClient } from '../client';
import type {
  BulkCandidateIngestionRequest,
  BulkCandidateIngestionResponse,
} from '@/lib/types/bulkIngestion';

export async function bulkIngestCandidates(
  request: BulkCandidateIngestionRequest
): Promise<BulkCandidateIngestionResponse> {
  return apiClient<BulkCandidateIngestionResponse>(
    '/api/v1/candidates/bulk-ingest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );
}
