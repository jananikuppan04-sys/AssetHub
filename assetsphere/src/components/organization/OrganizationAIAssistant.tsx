"use client"

import { useState } from "react"
import { Bot, Send, Sparkles } from "lucide-react"

export default function OrganizationAIAssistant({ departments }: { departments: any[] }) {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    
    // Simulate AI response based on local data for now
    setTimeout(() => {
      const q = query.toLowerCase()
      let ans = ""
      
      if (q.includes("most assets")) {
        const sorted = [...departments].sort((a, b) => b._count.assets - a._count.assets)
        if (sorted.length > 0) {
          ans = `The **${sorted[0].name}** department currently manages the most assets (${sorted[0]._count.assets} assets across ${sorted[0]._count.members} employees).`
        } else {
          ans = "No departments have assets currently."
        }
      } else if (q.includes("inactive")) {
        const inactive = departments.filter(d => !d.active)
        if (inactive.length > 0) {
          ans = `There are ${inactive.length} inactive departments: ${inactive.map(d => d.name).join(", ")}.`
        } else {
          ans = "All departments are currently active."
        }
      } else if (q.includes("no assigned head") || q.includes("no head")) {
        const noHead = departments.filter(d => !d.head)
        if (noHead.length > 0) {
          ans = `The following departments have no assigned department head: ${noHead.map(d => d.name).join(", ")}.`
        } else {
          ans = "All departments currently have an assigned head."
        }
      } else {
        ans = "I'm an AI assistant for your organization data. Try asking 'Which department owns the most assets?' or 'Show inactive departments.'"
      }
      
      setResponse(ans)
      setIsLoading(false)
    }, 800)
  }

  const suggestions = [
    "Which department owns the most assets?",
    "Show inactive departments",
    "Show departments with no assigned head"
  ]

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-6 rounded-xl border border-indigo-800 shadow-sm flex flex-col h-full text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold flex items-center text-lg">
          <Bot className="w-5 h-5 mr-2 text-blue-300" />
          AI Organization Assistant
        </h3>
        <Sparkles className="w-5 h-5 text-indigo-400" />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm border border-white/10 text-sm overflow-y-auto">
          {response ? (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="leading-relaxed">{response}</p>
            </div>
          ) : (
            <div className="text-indigo-200 h-full flex flex-col justify-center">
              <p className="mb-4">Ask me anything about your organization's structure, departments, or asset distribution.</p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setQuery(s)}
                    className="block w-full text-left text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded transition-colors"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-indigo-950/50 border border-indigo-700/50 rounded-lg pl-4 pr-10 py-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
