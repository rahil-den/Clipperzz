import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log('Testing Gemini API...');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

  for (const modelName of models) {
    try {
      console.log(`\nTesting model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Reply with only the word "hello"');
      console.log(`  SUCCESS: ${result.response.text().trim()}`);

      // Also test JSON mode
      const model2 = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const r2 = await model2.generateContent('Return JSON: {"working": true}');
      console.log(`  JSON mode SUCCESS: ${r2.response.text().trim()}`);
      break; // Stop at first working model
    } catch (e) {
      console.error(`  FAILED: ${e.message.substring(0, 120)}`);
    }
  }
}

test();
