'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkIngestCandidates } from '@/lib/api/services/bulkIngestionService';
import type {
  CandidateS3Record,
  BulkCandidateIngestionResponse,
} from '@/lib/types/bulkIngestion';
import { Button } from '@/components/ui/Button/Button';

export default function BulkUploadPage() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BulkCandidateIngestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);

      // Parse JSON input
      const parsed = JSON.parse(jsonInput);

      // Extract candidates array
      let candidatesArray: any[] = [];

      if (Array.isArray(parsed)) {
        candidatesArray = parsed;
      } else if (parsed.candidates && Array.isArray(parsed.candidates)) {
        candidatesArray = parsed.candidates;
      } else {
        throw new Error('Invalid format. Expected an array or object with "candidates" array.');
      }

      // Transform to required format
      const candidates: CandidateS3Record[] = candidatesArray.map((item: any) => {
        const candidateId = item.candidateId?.$oid || item.candidate_id || item.candidateId;
        const resumeLink = item.candidateResumeLink || item.resume_link || item.resumeLink;

        if (!candidateId || !resumeLink) {
          throw new Error(`Missing required fields in record: ${JSON.stringify(item)}`);
        }

        return {
          candidate_id: candidateId,
          resume_link: resumeLink,
        };
      });

      if (candidates.length === 0) {
        throw new Error('No valid candidates found in input.');
      }

      // Call API
      const response = await bulkIngestCandidates({
        candidates,
        model: 'openai-gpt-4o',
      });

      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to process bulk upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleJson = `[
  {
    "_id": { "$oid": "68cad6020255be00137f49ea" },
    "candidateId": { "$oid": "6864ffd1b2aa170013a89d72" },
    "candidateResumeLink": "https://unberry-ats-prod.s3.ap-south-1.amazonaws.com/candidate/unberry/resumes/resume.pdf"
  },
  {
    "_id": { "$oid": "68cad5870255be00137f49df" },
    "candidateId": { "$oid": "6864ffd1b2aa170013a89d73" },
    "candidateResumeLink": "https://unberry-ats-prod.s3.ap-south-1.amazonaws.com/candidate/unberry/resumes/resume2.pdf"
  }
]`;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => router.push('/candidates')}
            className="mb-4"
          >
            ← Back to Candidates
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Candidates</h1>
          <p className="mt-2 text-gray-600">
            Upload multiple candidate resumes from S3 URLs using JSON format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Paste JSON Data
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Paste your JSON array with candidate records. Each record must have:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">candidateId</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">candidate_id</code></li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">candidateResumeLink</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">resume_link</code></li>
              </ul>
            </p>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-96 font-mono text-sm border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              disabled={isProcessing}
            />

            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!jsonInput.trim() || isProcessing}
                isLoading={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process Candidates'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setJsonInput(exampleJson)}
                disabled={isProcessing}
              >
                Load Example
              </Button>
            </div>
          </div>

          {/* Example/Result Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {result ? 'Processing Results' : 'Example Format'}
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {result ? (
              <div>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.total_submitted}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-800">
                      {result.successful}
                    </div>
                    <div className="text-sm text-green-600">Successful</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-2xl font-bold text-red-800">
                      {result.failed}
                    </div>
                    <div className="text-sm text-red-600">Failed</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Processing time: {result.processing_time_seconds}s
                </p>

                {/* Results List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {result.results.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        item.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-mono text-xs text-gray-600">
                            {item.candidate_id}
                          </p>
                          <p className="text-sm mt-1">
                            {item.status === 'success' ? (
                              <span className="text-green-800">✓ {item.message}</span>
                            ) : (
                              <span className="text-red-800">✗ {item.error || item.message}</span>
                            )}
                          </p>
                          {item.neo4j_candidate_id && (
                            <p className="text-xs text-gray-500 mt-1">
                              Neo4j ID: {item.neo4j_candidate_id}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={() => router.push('/candidates')}>
                    View All Candidates
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setResult(null);
                      setJsonInput('');
                      setError(null);
                    }}
                  >
                    Upload More
                  </Button>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs overflow-x-auto text-gray-800">
                {exampleJson}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
