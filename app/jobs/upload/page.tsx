'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/ui/FileUpload';
import { uploadJobDescription } from '@/lib/api/services/jobService';
import type { JobUploadResponse } from '@/lib/types/job';
import { SkillBadge } from '@/components/ui/SkillBadge';

export default function JobUploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<JobUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setError(null);
      const result = await uploadJobDescription(file);
      setUploadResult(result);

      // Redirect to jobs list after 3 seconds
      setTimeout(() => {
        router.push('/jobs');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload job description');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Job Description</h1>
          <p className="mt-2 text-gray-600">
            Upload a PDF or text file containing the job description. Our AI will extract key
            information including skills, experience requirements, and more.
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <FileUpload
            onFileSelect={setSelectedFile}
            onUpload={handleUpload}
            acceptedFormats={['.pdf', '.txt', '.docx']}
            maxSizeMB={10}
          />

          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="mt-6 rounded-md bg-green-50 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-green-900">
                    Job Description Uploaded Successfully!
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">Title:</p>
                      <p className="text-green-900">{uploadResult.data.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Company:</p>
                      <p className="text-green-900">{uploadResult.data.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Location:</p>
                      <p className="text-green-900">{uploadResult.data.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 mb-2">Extracted Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {uploadResult.data.skills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} variant="neutral" />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-green-800">
                      <p>Processing time: {uploadResult.data.processing_time.toFixed(2)}s</p>
                      <p className="mt-1">Redirecting to jobs list...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
