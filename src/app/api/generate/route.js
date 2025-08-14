import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { createClient } from '@/utils/supabase/server'

// Server-side AI model - API key is secure here
const aiModel = google('gemini-2.5-flash', {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(request) {
  try {
    const { prompt, userId } = await request.json()

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 })
    }

    // Verify user is authenticated via Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate text
    const { text } = await generateText({
      model: aiModel,
      prompt: prompt,
    })

    return Response.json({ text })
  } catch (error) {
    console.error('Text generation API error:', error)
    return Response.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    )
  }
}
