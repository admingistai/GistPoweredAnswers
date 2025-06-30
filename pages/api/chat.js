import { openaiChatCompletion } from './utils/openaiChat';

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

    // Compose messages for OpenAI API
    let userPrompt = question;
    if (context && typeof context === 'string' && context.trim().length > 0) {
      userPrompt = `If the question is relating to the context of the website, use this URL: ${context} If not, just answer the question normally.\n\n${question}`;
    }
    const messages = [
      { role: 'user', content: userPrompt }
    ];
    log('Messages:', JSON.stringify(messages));

    // Call OpenAI chat completion utility
    const chatResult = await openaiChatCompletion({ messages });
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