/**
 * Chat Service for Knowledge Graph Q&A
 */
import axios from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  ClearChatHistoryRequest,
  ClearChatHistoryResponse,
} from '@/lib/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Send a chat message to the knowledge graph
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>(
    `${API_BASE_URL}/api/v1/chat`,
    {
      question: request.question,
      session_id: request.session_id || 'default_session',
      model: request.model || 'openai-gpt-4o',
      mode: request.mode || 'hybrid',
      top_k: request.top_k || 5,
    }
  );

  return response.data;
}

/**
 * Clear chat history for a session
 */
export async function clearChatHistory(
  sessionId: string
): Promise<ClearChatHistoryResponse> {
  const response = await axios.post<ClearChatHistoryResponse>(
    `${API_BASE_URL}/api/v1/chat/clear-history`,
    {
      session_id: sessionId,
    }
  );

  return response.data;
}
