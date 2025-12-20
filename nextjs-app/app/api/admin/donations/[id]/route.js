import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    // Check authentication
    const user = await getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = params.id;

    const donations = await query(
      `SELECT 
        donations.*,
        donors.*,
        donations.id as donation_id,
        donations.created_at as donation_created_at,
        donations.updated_at as donation_updated_at
      FROM donations
      JOIN donors ON donations.donor_id = donors.id
      WHERE donations.id = ?`,
      [id]
    );

    if (donations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: donations[0],
    });
  } catch (error) {
    console.error('Get donation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch donation', error: error.message },
      { status: 500 }
    );
  }
}
