import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyB02s10O026P1yJzY2vjqlFf0rH-LmWF9U';
const MODEL_NAME = 'gemini-2.0-flash';

// Initialize the Gemini API
let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Send a text prompt to Gemini and get a response
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated text response
 */
export const askGemini = async (prompt: string): Promise<string> => {
  try {
    // Initialize if not already done
    if (!genAI) {
      initializeGemini();
    }

    // Get the generative model
    const model = genAI!.getGenerativeModel({ model: MODEL_NAME });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Send a conversation history to Gemini for context-aware responses
 * @param messages - Array of messages with role and content
 * @returns The generated text response
 */
export const askGeminiWithContext = async (
  messages: Array<{ role: 'user' | 'model'; content: string }>
): Promise<string> => {
  try {
    if (!genAI) {
      initializeGemini();
    }

    const model = genAI!.getGenerativeModel({ model: MODEL_NAME });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Start chat with history
    const chat = model.startChat({
      history,
    });

    // Send the last message
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error calling Gemini API with context:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Stream responses from Gemini (for real-time text generation)
 * @param prompt - The text prompt to send
 * @param onChunk - Callback function called for each text chunk
 */
export const streamGemini = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    if (!genAI) {
      initializeGemini();
    }

    const model = genAI!.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('Error streaming from Gemini API:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
