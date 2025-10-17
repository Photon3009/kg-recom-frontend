'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJobRecommendations } from '@/lib/api/services/recommendationService';
import type { JobRecommendationResponse } from '@/lib/types/recommendation';
import { MatchScore } from '@/components/ui/MatchScore';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;

  const [recommendations, setRecommendations] = useState<JobRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topK, setTopK] = useState(10);
  const [minScore, setMinScore] = useState(0.3);

  useEffect(() => {
    loadRecommendations();
  }, [candidateId, topK, minScore]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getJobRecommendations(candidateId, topK, minScore);
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.total_recommendations === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">No Matching Jobs Found</h2>
            <p className="mt-2 text-gray-600">
              We couldn't find any jobs matching your profile. Try uploading more job descriptions
              or adjusting the minimum score threshold.
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push('/jobs/upload')}>Upload More Jobs</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Job Recommendations for {recommendations.candidate_name}
          </h1>
          <p className="mt-2 text-gray-600">
            Found {recommendations.total_recommendations} matching jobs with an average match score
            of {(recommendations.avg_match_score * 100).toFixed(0)}%
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Results
              </label>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Match Score
              </label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={0.2}>20%+</option>
                <option value={0.3}>30%+</option>
                <option value={0.4}>40%+</option>
                <option value={0.5}>50%+</option>
                <option value={0.6}>60%+</option>
                <option value={0.7}>70%+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {recommendations.top_matched_skills.length > 0 && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Top Skills in Demand</h3>
            <div className="flex flex-wrap gap-2">
              {recommendations.top_matched_skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} variant="matched" />
              ))}
            </div>
            {recommendations.common_missing_skills.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                  Skills to Learn (Commonly Required)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.common_missing_skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} variant="missing" />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Job Recommendations */}
        <div className="space-y-6">
          {recommendations.recommendations.map((job, index) => (
            <div key={job.job_id} className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.experience_required}
                        </span>
                        {job.salary && (
                          <span className="flex items-center">
                            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <ProgressBar
                        value={job.skill_match_score * 100}
                        label="Skills"
                        variant={job.skill_match_score >= 0.7 ? 'success' : job.skill_match_score >= 0.5 ? 'default' : 'warning'}
                      />
                      <p className="mt-1 text-xs text-gray-500">{job.skill_match_count}</p>
                    </div>
                    <div>
                      <ProgressBar
                        value={job.experience_match_score * 100}
                        label="Experience"
                        variant={job.experience_match ? 'success' : 'warning'}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {job.experience_match ? '✓ Meets requirement' : job.experience_gap || 'Partial match'}
                      </p>
                    </div>
                    <div>
                      <ProgressBar
                        value={job.location_match_score * 100}
                        label="Location"
                        variant={job.location_match ? 'success' : 'warning'}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {job.location_match ? '✓ Matching location' : 'Different location'}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Matched Skills ({job.matched_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.matched_skills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} variant="matched" />
                        ))}
                      </div>
                    </div>
                    {job.missing_skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Skills to Learn ({job.missing_skills.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.missing_skills.map((skill) => (
                            <SkillBadge key={skill} skill={skill} variant="missing" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/jobs/${job.job_id}`)}
                    >
                      View Full Job Description
                    </Button>
                  </div>
                </div>

                {/* Match Score */}
                <div className="ml-6 flex-shrink-0">
                  <MatchScore score={job.overall_score} percentage={job.match_percentage} size="lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
