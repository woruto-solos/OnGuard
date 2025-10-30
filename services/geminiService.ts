
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResponse, Scenario, TrendAnalyticsResponse, TutorResponse, ChatMessage, DashboardData, ConversationAnalysisResponse, QuizResponse, BehaviorAnalyticsResponse } from '../types';
import { RiskLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    risk_level: {
      type: Type.STRING,
      enum: [RiskLevel.Safe, RiskLevel.Suspicious, RiskLevel.Dangerous],
      description: 'Classification of the message risk.'
    },
    confidence: {
      type: Type.NUMBER,
      description: 'A value between 0 and 1 representing the confidence of the classification.'
    },
    explanation: {
      type: Type.STRING,
      description: 'A brief, clear explanation for the risk classification (max 50 words).'
    },
    suggested_action: {
      type: Type.STRING,
      description: '1-2 actionable safety steps the user should take.'
    },
    highlighted_phrases: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'The specific phrases in the message that are suspicious or dangerous.'
    },
    learning_tip: {
      type: Type.STRING,
      description: 'An educational tip or mini-lesson related to the detected risk.'
    },
    gamification_feedback: {
      type: Type.STRING,
      description: 'Feedback for the user, like awarding points or a badge for being cautious.'
    },
  },
  required: ['risk_level', 'confidence', 'explanation', 'suggested_action', 'highlighted_phrases', 'learning_tip', 'gamification_feedback'],
};


export const analyzeMessage = async (message: string): Promise<AnalysisResponse> => {
  const prompt = `
    You are "OnGuard 2.0", an AI cyber safety assistant.
    Your goals are to:
    - Detect scams, phishing, predatory messages, emotional manipulation, or unsafe content.
    - Explain your reasoning clearly.
    - Provide suggested safe actions.
    - Highlight risky phrases from the original message.
    - Offer a relevant educational tip.
    - Give encouraging, gamified feedback.
    - Respect privacy and do not store personal information.

    Analyze the following message.
    Return ONLY a valid JSON object matching the provided schema.

    Message: "${message}"
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the parsed object to ensure it conforms to the AnalysisResponse interface
    if (
      !Object.values(RiskLevel).includes(result.risk_level) ||
      typeof result.confidence !== 'number' ||
      typeof result.explanation !== 'string' ||
      typeof result.suggested_action !== 'string' ||
      !Array.isArray(result.highlighted_phrases) ||
      typeof result.learning_tip !== 'string' ||
      typeof result.gamification_feedback !== 'string'
    ) {
      throw new Error('Received malformed JSON from API');
    }

    return result as AnalysisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};

const scenarioResponseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        message: {
          type: Type.STRING,
          description: "The example message text."
        },
        risk_level: {
          type: Type.STRING,
          enum: [RiskLevel.Safe, RiskLevel.Dangerous],
          description: "Whether the message is 'Safe' or 'Dangerous'."
        },
        explanation: {
          type: Type.STRING,
          description: "A brief explanation of why the message is safe or dangerous."
        },
        learning_tip: {
          type: Type.STRING,
          description: "A concise, helpful tip related to the scenario."
        }
      },
      required: ['message', 'risk_level', 'explanation', 'learning_tip']
    }
  };

export const generateScenarios = async (count: number = 5): Promise<Scenario[]> => {
    const prompt = `
      You are an AI assistant creating educational content for a cyber safety app called "OnGuard".
      Your task is to generate a list of realistic example messages that a young person might receive online.
      
      Generate a JSON array containing exactly ${count} objects.
      - Aim for a mix of "Safe" and "Dangerous" messages.
      - "Dangerous" messages should include examples of phishing, scams, urgency tactics, or emotional manipulation.
      - "Safe" messages should be examples of normal, harmless online interactions.
      
      For each message, provide:
      1.  \`message\`: The text of the message.
      2.  \`risk_level\`: Either "Safe" or "Dangerous".
      3.  \`explanation\`: A clear, concise reason why the message is classified that way.
      4.  \`learning_tip\`: A short, actionable piece of advice.

      Return ONLY the valid JSON array.
    `;
  
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: scenarioResponseSchema,
              temperature: 0.9, // Higher temperature for more creative/varied scenarios
            },
          });
      
          const jsonText = response.text.trim();
          const result = JSON.parse(jsonText);

          if (!Array.isArray(result)) {
            throw new Error('API did not return an array');
          }

          result.forEach(item => {
            if (!item.message || !item.risk_level || !item.explanation || !item.learning_tip) {
                throw new Error('Scenario object is missing required fields');
            }
          });
      
          return result as Scenario[];

    } catch (error) {
      console.error("Error calling Gemini API for scenarios:", error);
      throw new Error("Failed to generate learning scenarios.");
    }
  };

  const trendAnalyticsResponseSchema = {
    type: Type.OBJECT,
    properties: {
      trend_summary: {
        type: Type.STRING,
        description: "A concise summary of current online threat trends for young users."
      },
      top_risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "The category of the risk (e.g., 'Phishing', 'Urgency Scams')." },
            frequency: { type: Type.NUMBER, description: "A relative score/percentage (0-100) of how common this risk is." }
          },
          required: ['type', 'frequency']
        }
      },
      platform_analysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, description: "The platform where risks are seen (e.g., 'Email', 'Social Media DMs')." },
            risk_count: { type: Type.NUMBER, description: "A relative score/percentage (0-100) of risks on this platform." }
          },
          required: ['platform', 'risk_count']
        }
      }
    },
    required: ['trend_summary', 'top_risks', 'platform_analysis']
  };
  
  export const getTrendAnalytics = async (): Promise<TrendAnalyticsResponse> => {
    const prompt = `
      You are "OnGuard 3.0", an AI cyber safety analyst.
      Based on your knowledge of current online threats, generate a plausible trend and analytics summary for a teen and student audience.
      This data simulates the analysis of thousands of anonymized messages.
  
      Provide a JSON object with:
      1.  \`trend_summary\`: A brief, easy-to-understand paragraph about what's currently happening in the world of online scams.
      2.  \`top_risks\`: An array of 4-5 common threat types (e.g., "Phishing Links", "Impersonation Scams", "Urgency Tactics") and a relative frequency score (0-100) for each. The highest frequency should be around 90.
      3.  \`platform_analysis\`: An array of 3-4 platforms (e.g., "Email", "Social Media DMs", "Text Messages") and a relative risk score (0-100) for each. The highest score should be around 85.
  
      Return ONLY the valid JSON object.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: trendAnalyticsResponseSchema,
          temperature: 0.6,
        },
      });
  
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
  
      // Basic validation
      if (!result.trend_summary || !Array.isArray(result.top_risks) || !Array.isArray(result.platform_analysis)) {
        throw new Error('Received malformed JSON for trends from API');
      }
  
      return result as TrendAnalyticsResponse;
  
    } catch (error) {
      console.error("Error calling Gemini API for trends:", error);
      throw new Error("Failed to get a valid trend analysis from the AI model.");
    }
  };

  const tutorResponseSchema = {
    type: Type.OBJECT,
    properties: {
      response_text: {
        type: Type.STRING,
        description: "The main, direct answer to the user's question."
      },
      learning_tip: {
        type: Type.STRING,
        description: "An educational tip or piece of advice related to the question."
      },
      suggested_exercise: {
        type: Type.STRING,
        description: "A simple, actionable exercise the user can do to practice the concept."
      }
    },
    required: ['response_text', 'learning_tip', 'suggested_exercise']
  };
  
  export const getTutorResponse = async (question: string, history: ChatMessage[]): Promise<TutorResponse> => {
    // We don't send the full history yet, but this is where it would be formatted.
    const prompt = `
      You are "OnGuard 3.0", a friendly and patient AI cyber safety tutor for young people.
      Your goal is to answer questions clearly and provide helpful, educational context.
  
      A user has asked the following question:
      "${question}"
  
      Provide a helpful response in a structured JSON format. The response should include:
      1.  \`response_text\`: A clear, direct answer to the question.
      2.  \`learning_tip\`: A related, actionable tip to help them stay safe.
      3.  \`suggested_exercise\`: A simple, practical task they can do to reinforce their learning.
  
      For example, if asked "what is a strong password?", you could suggest they try creating one and checking its strength on a safe website.
  
      Return ONLY the valid JSON object.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: tutorResponseSchema,
          temperature: 0.7,
        },
      });
  
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
  
      if (!result.response_text || !result.learning_tip || !result.suggested_exercise) {
        throw new Error('Received malformed JSON for tutor response from API');
      }
  
      return result as TutorResponse;
  
    } catch (error) {
      console.error("Error calling Gemini API for tutor:", error);
      throw new Error("Failed to get a valid response from the AI tutor.");
    }
  };

  const dashboardResponseSchema = {
    type: Type.OBJECT,
    properties: {
      safety_score: {
        type: Type.NUMBER,
        description: "A user's overall safety score from 0-100, based on recent activity."
      },
      predicted_risks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 2-3 short, predictive insights about potential upcoming risks."
      },
      recent_messages_summary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            message_snippet: { type: Type.STRING, description: "A short, privacy-safe snippet of a recent message." },
            risk_level: { type: Type.STRING, enum: [RiskLevel.Safe, RiskLevel.Suspicious, RiskLevel.Dangerous] },
            timestamp: { type: Type.STRING, description: "A human-readable timestamp like '2 hours ago'." }
          },
          required: ['message_snippet', 'risk_level', 'timestamp']
        }
      }
    },
    required: ['safety_score', 'predicted_risks', 'recent_messages_summary']
  };

  export const getDashboardData = async (): Promise<DashboardData> => {
    const prompt = `
      You are "OnGuard 3.0", an AI cyber safety analyst.
      Generate a plausible dashboard summary for a user. This simulates an analysis of their recent activity.
      
      Provide a JSON object with:
      1. \`safety_score\`: A number between 60 and 95.
      2. \`predicted_risks\`: An array of 2-3 brief, forward-looking sentences about potential threats to watch out for. For example, "Watch out for impersonation scams on social media this week."
      3. \`recent_messages_summary\`: An array of 3 realistic, recent message analyses. Each should have:
         - \`message_snippet\`: A short, anonymized preview of a message (e.g., "Hey, check out this link...").
         - \`risk_level\`: "Safe", "Suspicious", or "Dangerous".
         - \`timestamp\`: A recent, relative time like "30 minutes ago", "5 hours ago", or "Yesterday".
    
      Ensure the data is realistic and helpful for a young user. Return ONLY the valid JSON object.
    `;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: dashboardResponseSchema,
          temperature: 0.8,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      if (typeof result.safety_score !== 'number' || !Array.isArray(result.predicted_risks) || !Array.isArray(result.recent_messages_summary)) {
        throw new Error('Received malformed JSON for dashboard from API');
      }

      return result as DashboardData;

    } catch (error) {
      console.error("Error calling Gemini API for dashboard:", error);
      throw new Error("Failed to get a valid dashboard data from the AI model.");
    }
  };

  const conversationAnalysisResponseSchema = {
    type: Type.OBJECT,
    properties: {
      overall_risk_level: {
        type: Type.STRING,
        enum: [RiskLevel.Safe, RiskLevel.Suspicious, RiskLevel.Dangerous],
        description: "The cumulative risk of the entire conversation."
      },
      overall_explanation: {
        type: Type.STRING,
        description: "A summary of why the conversation has this overall risk level, focusing on patterns or escalation."
      },
      message_risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            message_content: { type: Type.STRING, description: "The exact text of the message being analyzed." },
            risk_level: { type: Type.STRING, enum: [RiskLevel.Safe, RiskLevel.Suspicious, RiskLevel.Dangerous] },
            highlighted_phrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING, description: "An explanation for this specific message's risk." }
          },
          required: ['message_content', 'risk_level', 'highlighted_phrases', 'explanation']
        }
      }
    },
    required: ['overall_risk_level', 'overall_explanation', 'message_risks']
  };

  export const analyzeConversation = async (conversation: string): Promise<ConversationAnalysisResponse> => {
    const prompt = `
      You are OnGuard, an AI cyber safety assistant.
      Analyze the following conversation thread for scams, predatory behavior, or manipulation. Pay close attention to cumulative tone, manipulative patterns, and risk escalation over multiple messages.
      The conversation is provided as a block of text where each message is separated by a new line.
  
      Return a JSON object with:
      - "overall_risk_level": The cumulative risk of the entire conversation ('Safe', 'Suspicious', 'Dangerous').
      - "overall_explanation": A summary of why the conversation has this overall risk level.
      - "message_risks": An array where each object represents a single message from the thread and its analysis. Each object must contain:
          - "message_content": The exact text of the message being analyzed.
          - "risk_level": The risk of that specific message.
          - "highlighted_phrases": Phrases within that message that contribute to its risk.
          - "explanation": An explanation for that specific message's risk.
  
      Conversation Thread:
      "${conversation}"
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: conversationAnalysisResponseSchema,
          temperature: 0.4,
        },
      });
  
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
  
      if (!result.overall_risk_level || !result.overall_explanation || !Array.isArray(result.message_risks)) {
        throw new Error('Received malformed JSON for conversation analysis from API');
      }
  
      return result as ConversationAnalysisResponse;
  
    } catch (error) {
      console.error("Error calling Gemini API for conversation analysis:", error);
      throw new Error("Failed to get a valid conversation analysis from the AI model.");
    }
  };

  const quizResponseSchema = {
    type: Type.OBJECT,
    properties: {
      quiz_title: { type: Type.STRING, description: "A short, engaging title for the quiz." },
      gamification_points: { type: Type.NUMBER, description: "The total points awarded for completing the quiz successfully." },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The quiz question." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 possible answers." },
            correct_answer: { type: Type.STRING, description: "The correct answer from the options." },
            explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." },
          },
          required: ['question', 'options', 'correct_answer', 'explanation']
        }
      }
    },
    required: ['quiz_title', 'questions', 'gamification_points']
  };

  export const generateQuiz = async (): Promise<QuizResponse> => {
    const topics = ["Phishing Scams", "Strong Passwords", "Social Media Privacy", "Online Bullying", "Recognizing Misinformation"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `
      You are "OnGuard 3.0", an AI cyber safety educator.
      Your task is to create a short, engaging quiz for a young user to reinforce their learning.

      Generate a quiz about the topic: "${randomTopic}".

      The quiz should contain exactly 3 multiple-choice questions.
      For each question, provide 4 options. One option must be the correct answer.
      Also provide a brief explanation for why the correct answer is right.

      Return a JSON object with:
      - \`quiz_title\`: A title for the quiz, like "Phishing Phacts" or "Password Power-Up".
      - \`gamification_points\`: A number, set to 50.
      - \`questions\`: An array of 3 question objects, each containing:
          - \`question\`: The question text.
          - \`options\`: An array of 4 string options.
          - \`correct_answer\`: The string of the correct option.
          - \`explanation\`: A short explanation for the correct answer.

      Ensure the content is clear, concise, and educational. Return ONLY the valid JSON object.
    `;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: quizResponseSchema,
          temperature: 0.8,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      if (!result.quiz_title || !Array.isArray(result.questions) || typeof result.gamification_points !== 'number' || result.questions.length === 0) {
        throw new Error('Received malformed JSON for quiz from API');
      }

      return result as QuizResponse;

    } catch (error) {
      console.error("Error calling Gemini API for quiz:", error);
      throw new Error("Failed to generate a valid quiz from the AI model.");
    }
  };

  const behaviorAnalyticsResponseSchema = {
    type: Type.OBJECT,
    properties: {
      behavior_summary: {
        type: Type.STRING,
        description: "A summary of the user's online behavior patterns, highlighting safe and risky trends."
      },
      predicted_risks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 2-3 specific risks the user is likely to encounter based on their behavior."
      },
      recommended_actions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 2-3 actionable steps the user can take to improve their safety."
      }
    },
    required: ['behavior_summary', 'predicted_risks', 'recommended_actions']
  };
  
  export const getBehaviorAnalytics = async (): Promise<BehaviorAnalyticsResponse> => {
    // In a real app, this prompt would include anonymized, aggregated user data.
    // Here, we simulate it for a user who tends to click on suspicious links.
    const prompt = `
      You are "OnGuard 3.0", an AI behavioral analyst specializing in cyber safety for young users.
      Based on the following simulated user activity patterns, generate a privacy-preserving behavioral analysis.
  
      Simulated Data:
      - Frequently engages with direct messages from unknown accounts.
      - Has a high click-through rate on links in emails, including ones flagged as 'Suspicious'.
      - Spends significant time on social media platforms known for impersonation scams.
      - Has completed the 'Phishing Basics' learning module.
  
      Generate a JSON object with:
      1.  \`behavior_summary\`: A brief, non-judgmental paragraph summarizing these patterns.
      2.  \`predicted_risks\`: An array of 2-3 specific, potential risks this user might face soon.
      3.  \`recommended_actions\`: An array of 2-3 clear, encouraging, and actionable recommendations for the user.
  
      Return ONLY the valid JSON object.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: behaviorAnalyticsResponseSchema,
          temperature: 0.7,
        },
      });
  
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
  
      if (!result.behavior_summary || !Array.isArray(result.predicted_risks) || !Array.isArray(result.recommended_actions)) {
        throw new Error('Received malformed JSON for behavior analytics from API');
      }
  
      return result as BehaviorAnalyticsResponse;
  
    } catch (error) {
      console.error("Error calling Gemini API for behavior analytics:", error);
      throw new Error("Failed to get valid behavior analytics from the AI model.");
    }
  };
