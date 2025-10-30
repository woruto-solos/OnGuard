
export enum RiskLevel {
  Safe = 'Safe',
  Suspicious = 'Suspicious',
  Dangerous = 'Dangerous',
}

export interface AnalysisResponse {
  risk_level: RiskLevel;
  confidence: number;
  explanation: string;
  suggested_action: string;
  highlighted_phrases: string[];
  learning_tip: string;
  gamification_feedback: string;
}

export interface Scenario {
  message: string;
  risk_level: RiskLevel.Safe | RiskLevel.Dangerous;
  explanation: string;
  learning_tip: string;
}

export interface TopRisk {
  type: string;
  frequency: number; // Represents a percentage or relative score
}

export interface PlatformAnalysis {
  platform: string;
  risk_count: number; // Represents a percentage or relative score
}

export interface TrendAnalyticsResponse {
  trend_summary: string;
  top_risks: TopRisk[];
  platform_analysis: PlatformAnalysis[];
}

export interface TutorResponse {
  response_text: string;
  learning_tip: string;
  suggested_exercise: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string | TutorResponse;
}

export interface RecentMessageSummary {
  message_snippet: string;
  risk_level: RiskLevel;
  timestamp: string;
}

export interface DashboardData {
  recent_messages_summary: RecentMessageSummary[];
  safety_score: number;
  predicted_risks: string[];
}

export interface MessageRisk {
  message_content: string;
  risk_level: RiskLevel;
  highlighted_phrases: string[];
  explanation: string;
}

export interface ConversationAnalysisResponse {
  overall_risk_level: RiskLevel;
  overall_explanation: string;
  message_risks: MessageRisk[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string; // Explanation for the correct answer
}

export interface QuizResponse {
  quiz_title: string;
  questions: QuizQuestion[];
  gamification_points: number;
}

export interface BehaviorAnalyticsResponse {
  behavior_summary: string;
  predicted_risks: string[];
  recommended_actions: string[];
}
