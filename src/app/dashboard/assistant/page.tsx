"use client"

import { useState } from "react"
import { Bot, Send, User } from "lucide-react"

export default function AssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Asset Assistant. I can help you find assets, check maintenance status, or identify idle resources. What do you need help with today?" }
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
      } else {
        throw new Error(data.error || "Failed to fetch")
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error while processing your request. Please ensure GEMINI_API_KEY is configured." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 p-4 flex items-center text-white">
        <Bot className="h-6 w-6 mr-3" />
        <div>
          <h2 className="font-bold text-lg">AI Asset Assistant</h2>
          <p className="text-blue-100 text-xs">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-100 ml-3" : "bg-emerald-100 mr-3"}`}>
                {msg.role === "user" ? <User className="h-4 w-4 text-blue-600" /> : <Bot className="h-4 w-4 text-emerald-600" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-emerald-100 mr-3">
                <Bot className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 rounded-tl-none flex space-x-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <form onSubmit={handleSend} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about assets, maintenance, or analytics..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
