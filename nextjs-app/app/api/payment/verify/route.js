import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '@/lib/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'All payment parameters are required' },
        { status: 400 }
      );
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
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

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update donation status
    await query(
      `UPDATE donations 
       SET razorpay_payment_id = ?,
           razorpay_signature = ?,
           status = 'success',
           payment_method = ?,
           payment_response = ?,
           payment_date = NOW(),
           updated_at = NOW()
       WHERE id = ?`,
      [
        razorpay_payment_id,
        razorpay_signature,
        payment.method || null,
        JSON.stringify(payment),
        donation.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        donation_id: donation.id,
        status: 'success',
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during payment verification', error: error.message },
      { status: 500 }
    );
  }
}
