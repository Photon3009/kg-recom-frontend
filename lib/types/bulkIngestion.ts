export interface CandidateS3Record {
  candidate_id: string;
  resume_link: string;
}

export interface BulkCandidateIngestionRequest {
  candidates: CandidateS3Record[];
  model?: string;
}

export interface CandidateIngestionResult {
  candidate_id: string;
  status: 'success' | 'failed';
  message: string;
  neo4j_candidate_id?: string;
  error?: string;
}

export interface BulkCandidateIngestionResponse {
  total_submitted: number;
  successful: number;
  failed: number;
  results: CandidateIngestionResult[];
  processing_time_seconds: number;
}
