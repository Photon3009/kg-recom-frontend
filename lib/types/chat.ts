/**
 * Type definitions for chat/Q&A functionality
 */

export interface ChatRequest {
  question: string;
  session_id?: string;
  model?: string;
  mode?: 'vector' | 'graph' | 'hybrid' | 'fulltext' | 'entity';
  top_k?: number;
}

export interface ChatResponse {
  session_id: string;
  question: string;
  answer: string;
  sources: any[];
  context?: string | null;
  mode: string;
  model: string;
  total_tokens?: number;
  response_time?: number;
  node_details?: any;
  entities?: any;
  widget_code?: string | null;
  structured_data?: any[];
}

export interface ClearChatHistoryRequest {
  session_id: string;
}

export interface ClearChatHistoryResponse {
  session_id: string;
  message: string;
  success: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    mode?: string;
    response_time?: number;
    total_tokens?: number;
    context?: string;
    widget_code?: string;
    structured_data?: any[];
  };
}
