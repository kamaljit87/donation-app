import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { razorpay_order_id, error } = await request.json();

    if (!razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find donation by order ID
    const donations = await query(
      'SELECT * FROM donations WHERE razorpay_order_id = ?',
      [razorpay_order_id]
    );

    if (donations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Donation not found' },
        { status: 404 }
      );
    }

    const donation = donations[0];

    // Update donation status to failed
    await query(
      `UPDATE donations 
       SET status = 'failed',
           payment_response = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [JSON.stringify(error || {}), donation.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        donation_id: donation.id,
        status: 'failed',
      },
    });
  } catch (error) {
    console.error('Payment failed error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred', error: error.message },
      { status: 500 }
    );
  }
}
