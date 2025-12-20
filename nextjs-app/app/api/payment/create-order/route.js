import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { query } from '@/lib/db';

// Initialize Razorpay only if credentials are available
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export async function POST(request) {
  try {
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway not configured' },
        { status: 503 }
      );
    }

    const { donation_id, amount } = await request.json();

    if (!donation_id || !amount) {
      return NextResponse.json(
        { success: false, message: 'Donation ID and amount are required' },
        { status: 400 }
      );
    }

    // Get donation
    const donations = await query(
      'SELECT * FROM donations WHERE id = ?',
      [donation_id]
    );

    if (donations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Donation not found' },
        { status: 404 }
      );
    }

    const donation = donations[0];

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(amount) * 100), // Amount in paise
      currency: donation.currency || 'INR',
      receipt: `donation_${donation.id}`,
      notes: {
        donation_id: donation.id,
        donor_id: donation.donor_id,
      },
    });

    // Update donation with order ID
    await query(
      'UPDATE donations SET razorpay_order_id = ?, updated_at = NOW() WHERE id = ?',
      [order.id, donation.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order', error: error.message },
      { status: 500 }
    );
  }
}
