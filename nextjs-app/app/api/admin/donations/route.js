import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    // Check authentication
    const user = await getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '15');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const offset = (page - 1) * perPage;

    // Build query
    let whereConditions = [];
    let queryParams = [];

    if (status) {
      whereConditions.push('donations.status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push('(donors.name LIKE ? OR donors.email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM donations
      JOIN donors ON donations.donor_id = donors.id
      ${whereClause}
    `;
    const [countResult] = await query(countQuery, queryParams);
    const total = countResult.total;

    // Get donations with pagination
    const donationsQuery = `
      SELECT 
        donations.*,
        donors.name as donor_name,
        donors.email as donor_email,
        donors.phone as donor_phone,
        donors.anonymous as donor_anonymous
      FROM donations
      JOIN donors ON donations.donor_id = donors.id
      ${whereClause}
      ORDER BY donations.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const donations = await query(
      donationsQuery,
      [...queryParams, perPage, offset]
    );

    return NextResponse.json({
      success: true,
      data: {
        data: donations,
        current_page: page,
        per_page: perPage,
        total: total,
        last_page: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch donations', error: error.message },
      { status: 500 }
    );
  }
}
