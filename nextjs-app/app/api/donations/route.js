import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'amount'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate amount
    if (isNaN(data.amount) || parseFloat(data.amount) < 1) {
      return NextResponse.json(
        { success: false, message: 'Amount must be at least 1' },
        { status: 400 }
      );
    }

    const result = await transaction(async (conn) => {
      // Create or update donor
      const [donorResult] = await conn.execute(
        `INSERT INTO donors (name, email, phone, age, address, city, state, country, pincode, pan_number, anonymous, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           phone = VALUES(phone),
           age = VALUES(age),
           address = VALUES(address),
           city = VALUES(city),
           state = VALUES(state),
           country = VALUES(country),
           pincode = VALUES(pincode),
           pan_number = VALUES(pan_number),
           anonymous = VALUES(anonymous),
           updated_at = NOW()`,
        [
          data.name,
          data.email,
          data.phone || null,
          data.age || null,
          data.address || null,
          data.city || null,
          data.state || null,
          data.country || 'India',
          data.pincode || null,
          data.pan_number || null,
          data.anonymous || false,
        ]
      );

      // Get donor ID
      let donorId = donorResult.insertId;
      if (!donorId) {
        // If update, get the existing donor ID
        const [donors] = await conn.execute(
          'SELECT id FROM donors WHERE email = ?',
          [data.email]
        );
        donorId = donors[0].id;
      }

      // Create donation record
      const [donationResult] = await conn.execute(
        `INSERT INTO donations (donor_id, amount, currency, donation_type, purpose, notes, tax_exemption_certificate, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [
          donorId,
          parseFloat(data.amount),
          data.currency || 'INR',
          data.donation_type || 'one-time',
          data.purpose || null,
          data.notes || null,
          data.tax_exemption_certificate || false,
        ]
      );

      return {
        donation_id: donationResult.insertId,
        donor_id: donorId,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Donation record created successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create donation record', error: error.message },
      { status: 500 }
    );
  }
}
