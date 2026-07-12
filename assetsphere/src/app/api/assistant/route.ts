import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { prisma } from "@/lib/prisma"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" })

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const totalAssets = await prisma.asset.count()
    const underMaintenance = await prisma.asset.count({ where: { status: "Under Maintenance" } })
    const lostAssets = await prisma.asset.count({ where: { status: "Lost" } })

    const systemPrompt = `You are the AssetHub AI Assistant, a helpful AI built into an Enterprise Resource Planning system.
    You have access to the following organization data:
- Total Assets Registered: ${totalAssets}
- Assets Under Maintenance: ${underMaintenance}
- Lost Assets: ${lostAssets}

Provide a concise, helpful answer to the user's question based on ERP context.`

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUser query: ${message}` }] }
        ]
      })
      
      return NextResponse.json({ reply: response.text })
    } else {
      let reply = "I'm sorry, I don't have enough data to answer that right now."
      if (message.toLowerCase().includes("laptop")) {
        reply = "We currently have 45 laptops in our inventory. 3 are under maintenance and 42 are allocated to employees."
      } else if (message.toLowerCase().includes("maintenance") || message.toLowerCase().includes("overdue")) {
        reply = "Currently, there are 2 pending maintenance requests and 1 asset is overdue for return."
      } else if (message.toLowerCase().includes("idle")) {
        reply = "The IT Department has the highest number of idle assets (15 unused monitors)."
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      return NextResponse.json({ reply: `[Mock AI Response] ${reply} (Add GEMINI_API_KEY to .env to enable real AI).` })
    }
  } catch (error) {
    console.error("AI Assistant Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
