// OpenAI Chat Completion Utility
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function openaiChatCompletion({ messages, temperature = 0.7, maxTokens = 1000 }) {
  const debug = { logs: [] };
  function log(...args) { debug.logs.push(args.map(String).join(' ')); }

  if (!process.env.OPENAI_API_KEY) {
    log('❌ OPENAI_API_KEY missing');
    throw new Error('OPENAI_API_KEY not configured');
  }
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    log('❌ messages missing or invalid');
    throw new Error('messages is required');
  }

  log('Creating OpenAI chat completion with', messages.length, 'messages');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    const answer = completion.choices[0].message.content;
    log('OpenAI response:', answer.length, 'chars');
    
    return { 
      answer, 
      usage: completion.usage,
      debug 
    };
  } catch (error) {
    log('❌ OpenAI API error:', error.message);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export { openaiChatCompletion }; 