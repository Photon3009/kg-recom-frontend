'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { getRecommendationStats } from '@/lib/api/services/recommendationService';
import type { RecommendationStats } from '@/lib/types/recommendation';
import { getCandidatesForJDText } from '@/lib/api/services/jobMatchingService';
import type { JobMatchingResponse } from '@/lib/types/jobMatching';
import ChatWithWidgets from '@/components/ChatWithWidgets';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jdText, setJdText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobMatchingResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [topK, setTopK] = useState(10);
  const [minScore, setMinScore] = useState(0.3);
  const [includeLocationScore, setIncludeLocationScore] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getRecommendationStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchCandidates = async () => {
    if (!jdText.trim()) {
      setSearchError('Please enter a job description');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const results = await getCandidatesForJDText(jdText, topK, minScore, includeLocationScore);
      setSearchResults(results);
    } catch (err: any) {
      console.error('Failed to search candidates:', err);
      setSearchError(err.response?.data?.detail || 'Failed to search for candidates. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:scale-105"
        title="Chat with Knowledge Graph"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="font-semibold">Chat with KG</span>
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-7xl h-[700px] rounded-lg overflow-hidden shadow-2xl">
            <ChatWithWidgets onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">AI-Powered</span>
              <span className="block text-blue-600">Candidate Recommendation System</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-600 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Upload job descriptions and resumes. Our knowledge graph and AI will find the perfect
              matches based on skills, experience, and location.
            </p>

            {/* CTA Buttons */}
            <div className="mx-auto mt-10 max-w-4xl md:mt-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/jobs/upload')}
                  className="w-full sm:w-auto"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Upload Job Description
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push('/candidates/upload')}
                  className="w-full sm:w-auto"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Upload Resume
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push('/candidates/bulk-upload')}
                  className="w-full sm:w-auto"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Bulk Upload from S3
                </Button>
              </div>
            </div>

            {/* Chat CTA Banner */}
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Try Our AI-Powered Chat
                  </h3>
                  <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                    Ask natural language questions about candidates and get instant answers using hybrid retrieval
                    (Vector + Graph + Full-text search)
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowChat(true)}
                    className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start Chatting Now
                  </Button>
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-blue-100">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Semantic Search
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Graph Relationships
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Full-text Indexing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* JD Text Matching Section */}
          <div className="mt-16">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Matching Candidates</h2>
              <p className="text-gray-600 mb-6">
                Paste a job description below to find the most relevant candidates from our talent pool.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="jd-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    id="jd-text"
                    rows={8}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste the job description here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="top-k" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Results
                    </label>
                    <select
                      id="top-k"
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="min-score" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Match Score
                    </label>
                    <select
                      id="min-score"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0.1}>10%</option>
                      <option value={0.2}>20%</option>
                      <option value={0.3}>30%</option>
                      <option value={0.4}>40%</option>
                      <option value={0.5}>50%</option>
                    </select>
                  </div>
                </div>

                {/* Location Toggle */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="location-toggle"
                    checked={includeLocationScore}
                    onChange={(e) => setIncludeLocationScore(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="location-toggle" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    📍 Include Location in Matching Score
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      {includeLocationScore
                        ? "Location match contributes 10-15% to overall score"
                        : "Location is ignored, scores based on skills (60%) & experience (35%) only"}
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handleSearchCandidates}
                  disabled={isSearching || !jdText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find Candidates
                    </>
                  )}
                </Button>

                {searchError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{searchError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="mt-8 mx-auto max-w-4xl">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Found {searchResults.total_recommendations} Matching Candidates
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Job Title: {searchResults.job_title} • Average Match Score: {(searchResults.avg_match_score * 100).toFixed(0)}%
                  </p>
                  {searchResults.top_matched_skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700">Top Skills:</span>
                      {searchResults.top_matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {searchResults.recommendations.map((candidate) => (
                    <div
                      key={candidate.candidate_id}
                      className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                              {candidate.match_percentage} Match
                            </span>
                          </div>

                          {candidate.current_role && (
                            <p className="mt-1 text-sm text-gray-600">{candidate.current_role}</p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                            {candidate.location && (
                              <span className="flex items-center">
                                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {candidate.location}
                              </span>
                            )}
                            {candidate.total_experience && (
                              <span className="flex items-center">
                                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {candidate.total_experience}
                              </span>
                            )}
                          </div>

                          {/* Match Details with Percentage Breakdown */}
                          <div className="mt-4 space-y-3">
                            {/* Skills Match */}
                            <div className="rounded-md bg-blue-50 p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-blue-900">Skills Match</p>
                                <p className="text-xs font-bold text-blue-700">
                                  {(candidate.skill_match_score * 50).toFixed(0)}% / 50%
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-blue-700">
                                {candidate.skill_match_count}
                              </p>
                              <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${(candidate.skill_match_score * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Experience Match */}
                            <div className={`rounded-md p-3 ${candidate.experience_match ? 'bg-green-50' : 'bg-yellow-50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-xs font-medium ${candidate.experience_match ? 'text-green-900' : 'text-yellow-900'}`}>
                                  Experience Match
                                </p>
                                <p className={`text-xs font-bold ${candidate.experience_match ? 'text-green-700' : 'text-yellow-700'}`}>
                                  {(candidate.experience_match_score * 30).toFixed(0)}% / 30%
                                </p>
                              </div>
                              <p className={`text-sm font-semibold ${candidate.experience_match ? 'text-green-700' : 'text-yellow-700'}`}>
                                {candidate.experience_match ? 'Full Match' : 'Partial Match'}
                              </p>
                              <div className={`mt-2 h-2 rounded-full overflow-hidden ${candidate.experience_match ? 'bg-green-200' : 'bg-yellow-200'}`}>
                                <div
                                  className={`h-full rounded-full ${candidate.experience_match ? 'bg-green-600' : 'bg-yellow-600'}`}
                                  style={{ width: `${(candidate.experience_match_score * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Location Match */}
                            <div className={`rounded-md p-3 ${candidate.location_match ? 'bg-green-50' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-xs font-medium ${candidate.location_match ? 'text-green-900' : 'text-gray-900'}`}>
                                  Location Match
                                </p>
                                <p className={`text-xs font-bold ${candidate.location_match ? 'text-green-700' : 'text-gray-700'}`}>
                                  {(candidate.location_match_score * 15).toFixed(0)}% / 15%
                                </p>
                              </div>
                              <p className={`text-sm font-semibold ${candidate.location_match ? 'text-green-700' : 'text-gray-700'}`}>
                                {candidate.location_match ? 'Match' : 'Different Location'}
                              </p>
                              <div className={`mt-2 h-2 rounded-full overflow-hidden ${candidate.location_match ? 'bg-green-200' : 'bg-gray-200'}`}>
                                <div
                                  className={`h-full rounded-full ${candidate.location_match ? 'bg-green-600' : 'bg-gray-600'}`}
                                  style={{ width: `${(candidate.location_match_score * 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Base Score */}
                            <div className="rounded-md bg-purple-50 p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-purple-900">Base Score</p>
                                <p className="text-xs font-bold text-purple-700">5% / 5%</p>
                              </div>
                              <p className="text-sm font-semibold text-purple-700">
                                Automatic Bonus
                              </p>
                              <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full" style={{ width: '100%' }} />
                              </div>
                            </div>

                            {/* Knowledge Graph Relationship Bonus */}
                            {(candidate.kg_relationship_bonus || 0) > 0 && (
                              <div className="rounded-md bg-gradient-to-r from-amber-50 to-orange-50 p-3 border-2 border-amber-300">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-medium text-amber-900">🌐 KG Network Bonus</p>
                                  <p className="text-xs font-bold text-amber-700">
                                    {((candidate.kg_relationship_bonus || 0) * 100).toFixed(0)}% / 38%
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-amber-700 mb-2">
                                  Network Intelligence Score
                                </p>
                                <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden mb-3">
                                  <div
                                    className="h-full bg-amber-600 rounded-full"
                                    style={{ width: `${((candidate.kg_relationship_bonus || 0) / 0.38) * 100}%` }}
                                  />
                                </div>

                                {/* KG Score Breakdown */}
                                <div className="space-y-1 text-xs">
                                  {(candidate.company_network_score || 0) > 0 && (
                                    <div className="flex justify-between items-center text-amber-900">
                                      <span>🏢 Company Network:</span>
                                      <span className="font-semibold">{((candidate.company_network_score || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                  {(candidate.institution_network_score || 0) > 0 && (
                                    <div className="flex justify-between items-center text-amber-900">
                                      <span>🎓 Institution Network:</span>
                                      <span className="font-semibold">{((candidate.institution_network_score || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                  {(candidate.industry_cluster_score || 0) > 0 && (
                                    <div className="flex justify-between items-center text-amber-900">
                                      <span>🔗 Industry Clustering:</span>
                                      <span className="font-semibold">{((candidate.industry_cluster_score || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                  {(candidate.local_network_score || 0) > 0 && (
                                    <div className="flex justify-between items-center text-amber-900">
                                      <span>📍 Local Talent Pool:</span>
                                      <span className="font-semibold">{((candidate.local_network_score || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                  {(candidate.role_progression_score || 0) > 0 && (
                                    <div className="flex justify-between items-center text-amber-900">
                                      <span>📈 Role Progression:</span>
                                      <span className="font-semibold">{((candidate.role_progression_score || 0) * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Total Score Breakdown */}
                            <div className="rounded-md bg-gradient-to-r from-blue-50 to-green-50 p-4 border-2 border-blue-200">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-900">Total Match Score</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {candidate.match_percentage}
                                </p>
                              </div>
                              <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-gray-600">
                                <div>Skills: {(candidate.skill_match_score * 50).toFixed(1)}%</div>
                                <div>Exp: {(candidate.experience_match_score * 30).toFixed(1)}%</div>
                                <div>Location: {(candidate.location_match_score * 15).toFixed(1)}%</div>
                                <div>KG+Base: {((candidate.kg_bonus || candidate.kg_relationship_bonus || 0) * 100 + 5).toFixed(1)}%</div>
                              </div>
                            </div>

                            {/* KG Insights / Reasons */}
                            {candidate.reasons && candidate.reasons.length > 0 && (
                              <div className="rounded-md bg-indigo-50 p-3 border border-indigo-200">
                                <p className="text-xs font-bold text-indigo-900 mb-2">🎯 Why This Candidate Stands Out:</p>
                                <ul className="space-y-1.5 text-xs text-indigo-800">
                                  {candidate.reasons.map((reason: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-1.5 mt-0.5">•</span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Must-Have Skills */}
                          {candidate.matched_must_have_skills && candidate.matched_must_have_skills.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-700 mb-2">Must-Have Skills ✓</p>
                              <div className="flex flex-wrap gap-2">
                                {candidate.matched_must_have_skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 border border-emerald-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Optional Skills */}
                          {candidate.matched_optional_skills && candidate.matched_optional_skills.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-700 mb-2">Optional Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {candidate.matched_optional_skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* KG Reasoning - Why this candidate stands out */}
                          {candidate.kg_reasoning && candidate.kg_reasoning.length > 0 && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs font-semibold text-amber-900 mb-2">💡 Why This Candidate Stands Out:</p>
                              <ul className="space-y-1">
                                {candidate.kg_reasoning.map((reason, idx) => (
                                  <li key={idx} className="text-xs text-amber-800 flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/candidates/${candidate.candidate_id}`)}
                        >
                          View Profile
                        </Button>
                        {candidate.email && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${candidate.email}`}
                          >
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {!isLoading && stats && (
            <div className="mt-16">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_jobs}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_candidates}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Skills in Database</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_skills}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Avg Skills/Job</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avg_skills_per_job.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              {/* Top Skills */}
              {stats.top_demanded_skills && stats.top_demanded_skills.length > 0 && (
                <div className="mt-10 rounded-lg bg-white p-8 shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Top In-Demand Skills</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.top_demanded_skills.slice(0, 6).map((item, index) => (
                      <div key={item.skill} className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                        <div className="flex items-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                            {index + 1}
                          </span>
                          <span className="ml-3 font-medium text-gray-900">{item.skill}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.count} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">How It Works</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">1. Upload Documents</h3>
                <p className="mt-2 text-gray-600">Upload job descriptions and resumes in PDF, TXT, or DOCX format.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">2. AI Extraction</h3>
                <p className="mt-2 text-gray-600">Our AI extracts skills, experience, and requirements automatically.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">3. Get Matches</h3>
                <p className="mt-2 text-gray-600">Receive ranked job recommendations with detailed match scores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
