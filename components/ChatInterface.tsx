'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, clearChatHistory } from '@/lib/api/services/chatService';
import type { ChatMessage } from '@/lib/types/chat';

interface ChatInterfaceProps {
  sessionId?: string;
  onClose?: () => void;
}

export default function ChatInterface({ sessionId = 'default_session', onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'hybrid' | 'vector' | 'graph' | 'fulltext'>('hybrid');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        question: input,
        session_id: sessionId,
        mode,
        model: 'openai-gpt-4o',
        top_k: 5,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        metadata: {
          model: response.model,
          mode: response.mode,
          response_time: response.response_time,
          total_tokens: response.total_tokens,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.response?.data?.detail || error.message || 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      try {
        await clearChatHistory(sessionId);
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = [
    'Give me the best candidates from IIT colleges',
    'Show me candidates who have worked at Google',
    'Find candidates with 5+ years of Python experience',
    'List candidates from Bangalore with React skills',
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div>
          <h2 className="text-xl font-bold text-white">Knowledge Graph Chat</h2>
          <p className="text-sm text-blue-100 mt-1">
            Ask me anything about candidates or jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="px-3 py-1.5 text-sm rounded-md border border-blue-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Search mode: Hybrid uses vector + full-text + graph for best results"
          >
            <option value="hybrid">Hybrid</option>
            <option value="vector">Vector</option>
            <option value="graph">Graph</option>
            <option value="fulltext">Full-text</option>
          </select>

          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 text-sm text-blue-100 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
            title="Clear chat history"
          >
            Clear
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors p-1"
              title="Close chat"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Ask me questions about candidates, skills, experience, companies, or education.
              I use hybrid retrieval combining semantic search, graph relationships, and keyword matching.
            </p>

            {/* Example Questions */}
            <div className="max-w-2xl mx-auto">
              <p className="text-xs font-medium text-gray-500 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="px-4 py-2.5 text-sm text-left text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
              } px-4 py-3 shadow-sm`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.metadata && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-300/20 text-xs opacity-75">
                  {message.metadata.mode && (
                    <span>Mode: {message.metadata.mode}</span>
                  )}
                  {message.metadata.response_time && (
                    <span>{message.metadata.response_time}s</span>
                  )}
                  {message.metadata.total_tokens && (
                    <span>{message.metadata.total_tokens} tokens</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-r-lg rounded-tl-lg px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about candidates, jobs, skills, or companies..."
              rows={2}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
