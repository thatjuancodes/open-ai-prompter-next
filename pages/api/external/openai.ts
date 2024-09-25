import Error from 'next/error';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: req.body }
      ]
    });

    const firstResponse = completion?.choices[0]?.message?.content;
    return res.status(200).json({ result: firstResponse });
  }
  catch (error: Error) {
    return res.status(500).json({ message: 'Failed to fetch response from OpenAI', error: error.message });
  }
}
