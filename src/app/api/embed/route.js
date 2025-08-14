import { google } from '@ai-sdk/google'
import { embed } from 'ai'
import { createClient } from '@/utils/supabase/server'

// Server-side AI model - API key is secure here
const aiEmbeddingModel = google.textEmbedding('text-embedding-004', {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(request) {
  try {
    const { texts, userId } = await request.json()

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return Response.json({ error: 'Invalid texts array' }, { status: 400 })
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

    // Generate embeddings for all texts
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const { embedding } = await embed({
          model: aiEmbeddingModel,
          value: text,
        })
        return embedding
      })
    )

    return Response.json({ embeddings })
  } catch (error) {
    console.error('Embedding API error:', error)
    return Response.json(
      { error: 'Failed to generate embeddings' },
      { status: 500 }
    )
  }
}
