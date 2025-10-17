'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface PromptConfig {
  name: string;
  prompt_text: string;
  description: string;
  category: string;
  updated_at: string | null;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Record<string, PromptConfig>>({});
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/prompts`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.prompts) {
        setPrompts(data.prompts);
      } else {
        throw new Error('Invalid response format');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      showMessage('error', 'Failed to load prompts. Make sure the backend is running.');
      setPrompts({});
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSelectPrompt = (name: string) => {
    setSelectedPrompt(name);
    if (prompts[name]) {
      setEditedText(prompts[name].prompt_text);
    }
  };

  const handleUpdatePrompt = async () => {
    if (!selectedPrompt) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/prompts/${selectedPrompt}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt_text: editedText }),
      });

      if (response.ok) {
        showMessage('success', 'Prompt updated successfully');
        await fetchPrompts();
      } else {
        throw new Error('Failed to update prompt');
      }
    } catch (error) {
      console.error('Error updating prompt:', error);
      showMessage('error', 'Failed to update prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPrompt = async (name: string) => {
    if (!confirm(`Are you sure you want to reset "${name}" to its default value?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/prompts/${name}/reset`, {
        method: 'POST',
      });

      if (response.ok) {
        showMessage('success', 'Prompt reset successfully');
        await fetchPrompts();
        if (selectedPrompt === name && prompts[name]) {
          setEditedText(prompts[name].prompt_text);
        }
      } else {
        throw new Error('Failed to reset prompt');
      }
    } catch (error) {
      console.error('Error resetting prompt:', error);
      showMessage('error', 'Failed to reset prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('Are you sure you want to reset ALL prompts to their default values?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/prompts/reset-all`, {
        method: 'POST',
      });

      if (response.ok) {
        showMessage('success', 'All prompts reset successfully');
        await fetchPrompts();
        if (selectedPrompt && prompts[selectedPrompt]) {
          setEditedText(prompts[selectedPrompt].prompt_text);
        }
      } else {
        throw new Error('Failed to reset prompts');
      }
    } catch (error) {
      console.error('Error resetting prompts:', error);
      showMessage('error', 'Failed to reset all prompts');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      resume: 'bg-blue-100 text-blue-800',
      job: 'bg-green-100 text-green-800',
      schema: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prompt Management</h1>
        <p className="text-gray-600">
          Configure and customize the prompts used for resume and job description extraction
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompts List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Prompts</CardTitle>
              <CardDescription>Select a prompt to edit</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && Object.keys(prompts).length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading prompts...</div>
              ) : Object.keys(prompts).length === 0 ? (
                <div className="text-center py-8 text-gray-500">No prompts available</div>
              ) : (
                <div className="space-y-2">
                {Object.entries(prompts).map(([name, config]) => (
                  <button
                    key={name}
                    onClick={() => handleSelectPrompt(name)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPrompt === name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{name}</div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getCategoryColor(
                          config.category
                        )}`}
                      >
                        {config.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetPrompt(name);
                        }}
                        className="text-xs text-gray-500 hover:text-blue-600"
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </button>
                ))}
                </div>
              )}

              <button
                onClick={handleResetAll}
                disabled={loading}
                className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset All Prompts
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Editor */}
        <div className="lg:col-span-2">
          {selectedPrompt ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPrompt}</CardTitle>
                <CardDescription>
                  {prompts[selectedPrompt]?.description}
                  {prompts[selectedPrompt]?.updated_at && (
                    <span className="ml-2 text-xs">
                      (Last updated: {new Date(prompts[selectedPrompt].updated_at).toLocaleString()})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edit prompt text..."
                />

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleUpdatePrompt}
                    disabled={loading || editedText === prompts[selectedPrompt]?.prompt_text}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Prompt'}
                  </button>

                  <button
                    onClick={() => setEditedText(prompts[selectedPrompt].prompt_text)}
                    disabled={loading || editedText === prompts[selectedPrompt]?.prompt_text}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel Changes
                  </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>Changes take effect immediately for new extractions</li>
                    <li>Use template variables like <code className="bg-yellow-100 px-1 rounded">{'{resume_text}'}</code> or <code className="bg-yellow-100 px-1 rounded">{'{job_text}'}</code></li>
                    <li>Maintain the expected JSON output format for proper parsing</li>
                    <li>Test your changes with sample data before production use</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96 text-gray-500">
                Select a prompt from the list to edit
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
