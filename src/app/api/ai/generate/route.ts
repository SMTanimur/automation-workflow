import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    let systemPrompt = ''
    let userPrompt = prompt

    // Customize system prompt based on type
    switch (type) {
      case 'email-subject':
        systemPrompt = 'You are an expert email marketer. Generate compelling email subject lines that are engaging and drive opens. Keep them under 50 characters when possible.'
        break
      case 'email-content':
        systemPrompt = 'You are an expert email copywriter. Generate engaging email content that is conversational, valuable, and drives action. Use HTML formatting for headings and paragraphs.'
        break
      case 'email-button':
        systemPrompt = 'You are an expert conversion copywriter. Generate compelling button text for email CTAs that encourages clicks. Keep it short and action-oriented.'
        break
      default:
        systemPrompt = 'You are a helpful assistant. Generate high-quality content based on the user request.'
    }

    try {
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const generatedContent = completion.choices[0]?.message?.content || ''

      return NextResponse.json({ 
        content: generatedContent,
        type 
      })
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      // Fallback response if AI fails
      return NextResponse.json({ 
        content: `Generated content for: ${prompt}`,
        type,
        fallback: true
      })
    }
  } catch (error) {
    console.error('Error in AI generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}