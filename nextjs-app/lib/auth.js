import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function getUserFromRequest(req) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  const users = await query(
    'SELECT id, name, email, is_admin FROM users WHERE id = ?',
    [decoded.userId]
  );

  return users[0] || null;
}

export function requireAuth(handler) {
  return async (req, res) => {
    const user = await getUserFromRequest(req);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user.is_admin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    req.user = user;
    return handler(req, res);
  };
}
