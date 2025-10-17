'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCandidateById } from '@/lib/api/services/candidateService';
import { Candidate } from '@/lib/types/candidate';
import { Button } from '@/components/ui/Button/Button';
import { SkillBadge } from '@/components/ui/SkillBadge/SkillBadge';

export default function CandidateDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params.candidateId as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const data = await getCandidateById(candidateId);
      setCandidate(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidate details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">Error loading candidate details</p>
            <p className="text-red-600 mt-2">{error || 'Candidate not found'}</p>
            <div className="flex gap-3 justify-center mt-4">
              <Button onClick={fetchCandidateDetails} variant="secondary">
                Try Again
              </Button>
              <Button onClick={() => router.push('/candidates')}>
                Back to Candidates
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push('/candidates')}
            className="mb-4"
          >
            ← Back to Candidates
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {candidate.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  {candidate.current_role && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-semibold text-lg text-blue-600">
                        {candidate.current_role}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  candidate.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : candidate.status === 'Processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {candidate.status}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Email */}
          {candidate.email && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="font-semibold text-gray-900">Email</h2>
              </div>
              <p className="text-gray-700 text-lg">{candidate.email}</p>
            </div>
          )}

          {/* Phone */}
          {candidate.phone && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <h2 className="font-semibold text-gray-900">Phone</h2>
              </div>
              <p className="text-gray-700 text-lg">{candidate.phone}</p>
            </div>
          )}

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="font-semibold text-gray-900">Location</h2>
            </div>
            <p className="text-gray-700 text-lg">{candidate.location}</p>
          </div>

          {/* Total Experience */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="font-semibold text-gray-900">Total Experience</h2>
            </div>
            <p className="text-gray-700 text-lg font-semibold">{candidate.total_experience}</p>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {candidate.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Skills ({candidate.skills.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} variant="neutral" />
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {candidate.experience && candidate.experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Work Experience
            </h2>
            <div className="space-y-6">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education && candidate.education.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
            <div className="space-y-4">
              {candidate.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600 font-medium">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                  {edu.field && (
                    <p className="text-gray-700 mt-1">Field: {edu.field}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Candidate ID:</span>
              <span className="ml-2 text-gray-900 font-mono">{candidate.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 text-gray-900">
                {new Date(candidate.created_at).toLocaleString()}
              </span>
            </div>
            {candidate.updated_at && (
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(candidate.updated_at).toLocaleString()}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Graph Nodes:</span>
              <span className="ml-2 text-gray-900">{candidate.node_count || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Graph Relationships:</span>
              <span className="ml-2 text-gray-900">{candidate.relationship_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button onClick={() => router.push('/candidates')} variant="secondary">
            Back to Candidates
          </Button>
          <Button onClick={() => router.push(`/recommendations/${candidate.id}`)}>
            View Job Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}
