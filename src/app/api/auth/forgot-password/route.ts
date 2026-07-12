import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Don't leak whether the email exists or not
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." })
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "Account is inactive" }, { status: 400 })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    })

    // In a real application, you would send an email here using SendGrid/AWS SES/SMTP.
    // For local development, we'll log it.
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`
    console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`)

    return NextResponse.json({ 
      success: true, 
      message: "If an account exists, a reset link has been sent.",
      // Returning token only for local dev/testing purposes
      _devToken: token
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
