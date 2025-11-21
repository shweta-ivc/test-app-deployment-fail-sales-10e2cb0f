import { createClient } from '@/lib/supabase'
import { validateToken } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const userId = await validateToken(token)

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const supabase = createClient()
    const { data: chatInteraction, error } = await supabase
      .from('chat_interactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Chat interaction not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({
      id: chatInteraction.id,
      userId: chatInteraction.user_id,
      title: chatInteraction.title,
      prompt: chatInteraction.prompt,
      response: chatInteraction.response,
      model: chatInteraction.model,
      tokensUsed: chatInteraction.tokens_used,
      createdAt: chatInteraction.created_at,
      updatedAt: chatInteraction.updated_at
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chat interaction' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const userId = await validateToken(token)

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const data = await request.json()

    const { title, prompt, response, model, tokensUsed } = data

    if (!title || !prompt || !response || !model) {
      return NextResponse.json(
        { error: 'Title, prompt, response, and model are required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const { data: updatedChatInteraction, error } = await supabase
      .from('chat_interactions')
      .update({
        title,
        prompt,
        response,
        model,
        tokens_used: tokensUsed,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Chat interaction not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({
      id: updatedChatInteraction.id,
      userId: updatedChatInteraction.user_id,
      title: updatedChatInteraction.title,
      prompt: updatedChatInteraction.prompt,
      response: updatedChatInteraction.response,
      model: updatedChatInteraction.model,
      tokensUsed: updatedChatInteraction.tokens_used,
      createdAt: updatedChatInteraction.created_at,
      updatedAt: updatedChatInteraction.updated_at
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update chat interaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const userId = await validateToken(token)

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('chat_interactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Chat interaction not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete chat interaction' },
      { status: 500 }
    )
  }
}