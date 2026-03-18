import { useState } from 'react'
import { FaRobot, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const sendMessage = async () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { sender: 'user', text: input }])
    const userMessage = input
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/users/assistant/chat', {
        message: userMessage,
        history: messages.slice(-10) // send last 10 messages for context
      })
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }])
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I could not get a response from the AI.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-primary-600 text-white">
        <div className="flex items-center">
          <FaRobot className="mr-2" />
          <span className="font-semibold text-lg">AI Assistant Chat</span>
        </div>
        <button className="text-white text-2xl" onClick={() => navigate(-1)}>&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg shadow ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-gray-900 border'}`}>
              <div className="flex items-center">
                {msg.sender === 'ai' && <FaRobot className="mr-2 text-primary-600" />}
                {msg.sender === 'user' && <FaUser className="mr-2 text-white" />}
                <span>{msg.text}</span>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white border px-4 py-2 rounded-lg shadow text-gray-500">AI is typing...</div></div>}
      </div>
      <div className="p-4 bg-white border-t flex items-center">
        <input
          className="input flex-1 mr-2"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  )
}

export default Chat 