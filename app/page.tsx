'use client'

import { useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import TextInput from "./components/TextInput"
import styles from "./animation.module.css"
import TextArea from "./components/TextArea"

export default function Home() {
  // TODOS:
  // 1. Do a fetch from OPEN AI api [DONE]
  // 2. Display the response [DONE]
  // 3. Use streaming strategy to display the response [DONE]
  // 4. Add a form to take user input [DONE]
  // 5. Improve the UI/UX [DONE]
  // 6. Update README [DONE]
  const [openAIResponse, setOpenAIResponse] = useState<string | null>('')
  const [userInput, setUserInput] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const responseEndRef = useRef<HTMLDivElement | null>(null)

  const handleOpenAIRequest = async () => {
    setIsSubmitted(true)
    setUserInput('')

    try {
      const response = await fetch('/api/external/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInput)
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
      
        // move to the bottom of the scroll view while we the response streams in
        if (responseEndRef.current === null) return
        responseEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Prevent default form submission
      handleOpenAIRequest()
    }
  }

  return (
    <div className="flex flex-col items-center px-16 h-screen">
      {!isSubmitted &&
        <h1 className="text-4xl font-bold text-center mt-10">Open AI Prompter - Built on Next JS</h1>
      }

      {isSubmitted && (
        <div className={`text-left text-gray-900 mt-10 pb-5 w-full overflow-y-scroll ${isSubmitted ? 'h-full mb-52' : 'h-2/3'}`}>
          {openAIResponse &&
            // additional render functions need to be used to make the headings work
            <ReactMarkdown className="text-lg">{openAIResponse}</ReactMarkdown>
          }

          <div ref={responseEndRef} />
        </div>
      )}

      <div className={`transition-transform duration-1000 ease-in-out ${isSubmitted ? `fixed left-16 right-16 transform ${styles.translateY2full} bottom-0` : 'transform relative w-full translate-y-0'}`}>
        {isSubmitted ?
          <>
            <span className="float-right text-gray-400 italic">Use SHIFT + RETURN/ENTER to add a newline | Hit ENTER/RETURN to submit your queries...</span>

            <TextArea label="Feed me more human..." value={userInput} onChange={setUserInput} onKeyDown={handleKeyDown} />
          </>
        :
          <TextInput label="Give 'IT' a spin..." value={userInput} onChange={setUserInput} onKeyDown={handleKeyDown} />
        }

        {!isSubmitted &&
          <button
            className="mt-5 w-full px-5 py-3 bg-blue-700 text-white text-xl hover:bg-blue-600 rounded"
            onClick={handleOpenAIRequest}
          >
            Submit
          </button>
        }
      </div>
    </div>
  )
}
