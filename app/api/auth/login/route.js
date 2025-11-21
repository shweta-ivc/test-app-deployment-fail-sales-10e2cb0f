'use server';

import { createClient } from '@/lib/supabase'
import { signToken } from '@/lib/jwt'
import { loginSchema } from '@/lib/validation'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Create Supabase client
    const supabase = createClient()

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, password_hash, created_at')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signToken({ 
      sub: user.id,
      email: user.email
    })

    // Return success response with token
    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    }, { status: 200 })

  } catch (error) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return Response.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('Login error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}