'use client'

import { useState } from "react";

export default function Home() {
  // TODOS:
  // 1. Do a fetch from OPEN AI api [DONE]
  // 2. Display the response
  // 3. Use streaming strategy to display the response
  // 4. Add a form to take user input
  // 5. Improve the UI/UX
  // 6. Update README
  const [openAIResponse, setOpenAIResponse] = useState('')

  const handleOpenAIRequest = async () => {
    try {
      const response = await fetch('/api/external/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify('write a funny joke about a programmer applying for an ai job')
      });

      const resultData = await response.json()
      setOpenAIResponse(resultData.result)
    }
    catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="text-center flex flex-col items-center">
      <h1 className="mt-4 text-4xl font-bold text-center">Open AI Prompter - Built on Next JS</h1>

      <p>{openAIResponse}</p>

      <button className="mt-10 px-5 py-2 bg-green-500 text-white" onClick={handleOpenAIRequest}>Boom!</button>
    </div>
  );
}
