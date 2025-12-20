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

    // Get total donations amount
    const [totalResult] = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM donations 
       WHERE status = 'success'`
    );

    // Get total donors count
    const [donorsResult] = await query(
      'SELECT COUNT(*) as total FROM donors'
    );

    // Get total transactions count
    const [transactionsResult] = await query(
      'SELECT COUNT(*) as total FROM donations'
    );

    // Get successful donations count
    const [successfulResult] = await query(
      `SELECT COUNT(*) as total 
       FROM donations 
       WHERE status = 'success'`
    );

    // Get pending donations count
    const [pendingResult] = await query(
      `SELECT COUNT(*) as total 
       FROM donations 
       WHERE status = 'pending'`
    );

    // Get failed donations count
    const [failedResult] = await query(
      `SELECT COUNT(*) as total 
       FROM donations 
       WHERE status = 'failed'`
    );

    // Get recent successful donations
    const recentDonations = await query(
      `SELECT 
        donations.*,
        donors.name as donor_name,
        donors.email as donor_email,
        donors.anonymous as donor_anonymous
      FROM donations
      JOIN donors ON donations.donor_id = donors.id
      WHERE donations.status = 'success'
      ORDER BY donations.created_at DESC
      LIMIT 5`
    );

    return NextResponse.json({
      success: true,
      data: {
        total_donations: parseFloat(totalResult.total),
        total_donors: donorsResult.total,
        total_transactions: transactionsResult.total,
        successful_donations: successfulResult.total,
        pending_donations: pendingResult.total,
        failed_donations: failedResult.total,
        recent_donations: recentDonations,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics', error: error.message },
      { status: 500 }
    );
  }
}
