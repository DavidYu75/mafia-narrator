import { useState } from 'react'
import useWebSocket from 'react-use-websocket'

function App() {
  const [message, setMessage] = useState('')
  const { sendMessage, lastMessage } = useWebSocket('ws://localhost:8000/ws', {
    shouldReconnect: () => true,
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mafia Narrator</h1>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter message"
            />
            <button
              onClick={() => sendMessage(message)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Send
            </button>
          </div>
          {lastMessage && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <span className="text-gray-600">Last message:</span>
              <span className="ml-2 text-gray-800">{lastMessage.data}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
