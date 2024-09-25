import { OpenAI } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: req.body }
      ],
      stream: true,
    })

    for await (const token of stream) {
      // open api sends the data back as a stream of tokens with a DONE state at the end to signify the end of the stream
      const content = token.choices[0].delta.content
      if (content) {
        res.write(content)
        // need to flush to make sure we're streaming back the data as soon as we get new content
        res.flush()
      }
    }
    res.end()
  }
  catch (error: unknown) {
    res.status(500).json({ message: 'Failed to fetch response from OpenAI', error: error.message })
    res.end()
  }
}
