import { createClient } from '@/lib/supabase';
import { validateChatInteraction } from '@/lib/validation';
import { getTokenFromHeaders, verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('chat_interactions')
      .select('*')
      .eq('user_id', decoded.id)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch chat interactions' }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateChatInteraction(body);

    if (!validation.success) {
      return Response.json({ error: 'Validation failed', details: validation.error }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('chat_interactions')
      .insert({
        ...body,
        user_id: decoded.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: 'Failed to create chat interaction' }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}