'use server';

import { createClient } from '@/lib/supabase'
import { validateRegistration } from '@/lib/validation'
import { hash } from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate input
    const validatedData = validateRegistration(data)

    const supabase = createClient(cookies())

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message)
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: validatedData.email,
        password: hashedPassword,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(insertError.message)
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'User registered successfully'
    }, { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    )
  }
}