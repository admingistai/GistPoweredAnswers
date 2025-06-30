const { openaiChatCompletion } = require('./utils/openaiChat');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const debug = { logs: [] };
  function log(...args) { debug.logs.push(args.map(String).join(' ')); }

  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      log('❌ Missing or invalid question');
      return res.status(400).json({ error: 'Missing or invalid question', debug });
    }

    // Use a stable user ID for demo purposes (in production, use session/user info or device ID)
    let userId = req.headers['x-user-id'] || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'demo-user';
    if (Array.isArray(userId)) userId = userId[0];
    userId = String(userId);
    log('User ID:', userId);

    // Compose messages for OpenAI API with enhanced context handling
    let userPrompt = '';
    
    if (context && typeof context === 'string' && context.trim().length > 0) {
      // Enhanced context is available - use it to provide better responses
      userPrompt = `You are an AI assistant that can answer questions about web pages. You have been provided with comprehensive information about the current webpage the user is viewing.

Here is the webpage information:
${context}

User's question: ${question}

Please provide a helpful and accurate answer based on the webpage content when relevant. If the question is not related to the webpage content, you can answer based on your general knowledge.`;
    } else {
      // Fallback to general question
      userPrompt = question;
    }
    
    const messages = [
      { role: 'user', content: userPrompt }
    ];
    log('Messages prepared, context length:', context ? context.length : 0);

    // Call OpenAI chat completion utility with enhanced context
    const chatResult = await openaiChatCompletion({ 
      messages, 
      maxTokens: 1500 // Increase token limit for more comprehensive responses
    });
    log('OpenAI chat result successful');

    return res.status(200).json({
      answer: chatResult.answer,
      response: chatResult.answer, // For backward compatibility with frontend
      usage: chatResult.usage,
      debug: { ...debug, chat: chatResult.debug }
    });
  } catch (error) {
    log('❌ API error:', error.message);
    return res.status(500).json({ error: 'Internal server error', details: error.message, debug });
  }
} 