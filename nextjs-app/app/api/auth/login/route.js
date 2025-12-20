import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'The provided credentials are incorrect' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'The provided credentials are incorrect' },
        { status: 401 }
      );
    }

    // Check if admin
    if (!user.is_admin) {
      return NextResponse.json(
        { success: false, message: 'You do not have admin access' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login', error: error.message },
      { status: 500 }
    );
  }
}
