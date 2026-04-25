import { useState } from 'react'

const initialMessage = {
  sender: 'assistant',
  text: 'Hi! I can help you understand the lesson, practice task, progress, or what to do next.',
}

const exampleQuestions = [
  'How do I complete this lesson?',
  'What is my practice task?',
  'How does progress work?',
]

function createAssistantResponse(message, lesson, progress) {
  const text = message.toLowerCase()

  if (text.includes('practice') || text.includes('task')) {
    if (lesson?.practice_instructions) {
      return `Your practice task is: ${lesson.practice_instructions}`
    }

    return 'This lesson does not have practice instructions yet. Review the lesson description and video, then try applying the main idea yourself.'
  }

  if (text.includes('progress') || text.includes('complete')) {
    if (progress) {
      return `You can mark this lesson as completed. Your course progress is ${progress.percentage}% with ${progress.completedLessons} of ${progress.totalLessons} lessons completed.`
    }

    return 'You can mark the lesson as completed, and your course progress will update automatically.'
  }

  if (text.includes('lesson') || text.includes('topic')) {
    const title = lesson?.title || 'this lesson'
    const description =
      lesson?.description || 'Read the lesson description to understand the main topic.'

    return `This lesson is "${title}". ${description}`
  }

  if (text.includes('video')) {
    return 'The video explains the main lesson topic. Watch it before completing the practice task.'
  }

  if (text.includes('course')) {
    return 'The course is divided into modules and lessons. Progress is calculated from completed lessons.'
  }

  if (text.includes('help')) {
    return 'Try watching the video, reading the description, completing the practice task, and marking the lesson as completed.'
  }

  return 'I am a simple demo assistant. Try asking about practice, progress, lesson, video, or course.'
}

function AIAssistant({ lesson, progress }) {
  const [messages, setMessages] = useState([initialMessage])
  const [input, setInput] = useState('')

  function sendMessage(messageText) {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage) {
      return
    }

    const userMessage = {
      sender: 'user',
      text: trimmedMessage,
    }
    const assistantMessage = {
      sender: 'assistant',
      text: createAssistantResponse(trimmedMessage, lesson, progress),
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ])
    setInput('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <section className="ai-assistant">
      <h2>AI Learning Assistant</h2>
      <p>Ask for help about this lesson, practice task, progress, or course.</p>

      <div className="example-questions">
        {exampleQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => sendMessage(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="chat-box">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.sender}`} key={index}>
            <strong>{message.sender === 'assistant' ? 'Assistant' : 'You'}</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit">Send</button>
      </form>
    </section>
  )
}

export default AIAssistant
