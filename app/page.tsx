'use client'

import { useState } from "react"
import ReactMarkdown from 'react-markdown'

export default function Home() {
  // TODOS:
  // 1. Do a fetch from OPEN AI api [DONE]
  // 2. Display the response [DONE]
  // 3. Use streaming strategy to display the response [DONE]
  // 4. Add a form to take user input
  // 5. Improve the UI/UX
  // 6. Update README
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null)

  const handleOpenAIRequest = async () => {
    try {
      const response = await fetch('/api/external/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify('tell me more about optimus prime')
      })

      // check if response.body even exists
      if (!response.body) {
        throw new Error('ReadableStream not supported')
      }

      // create a custom readable stream of the response.body
      const reader = response.body.getReader()
      // use a text decoder to conver the binary data back into utf-8 format
      const decoder = new TextDecoder('utf-8')
      let done = false
    
      while (!done) {
        // we stream through the data until we reached done state
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value, { stream: true })
        setOpenAIResponse((prev) => prev + chunk)
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-4 text-4xl font-bold text-center">Open AI Prompter - Built on Next JS</h1>

      <div className="text-left mt-10 mx-20">
        {openAIResponse &&
          // additional render functions need to be used to make the headings work
          <ReactMarkdown>{openAIResponse}</ReactMarkdown>
        }
      </div>

      <button className="mt-10 px-5 py-2 bg-green-500 text-white" onClick={handleOpenAIRequest}>Boom!</button>
    </div>
  )
}
