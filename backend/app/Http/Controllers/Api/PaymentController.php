<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    /**
     * Create Razorpay order
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'donation_id' => 'required|exists:donations,id',
            'amount' => 'required|numeric|min:1',
        ]);

        try {
            $donation = Donation::findOrFail($validated['donation_id']);

            // Create Razorpay order
            $order = $this->razorpay->order->create([
                'receipt' => 'donation_' . $donation->id,
                'amount' => $validated['amount'] * 100, // Amount in paise
                'currency' => $donation->currency,
                'notes' => [
                    'donation_id' => $donation->id,
                    'donor_id' => $donation->donor_id,
                ],
            ]);

            // Update donation with order ID
            $donation->update([
                'razorpay_order_id' => $order->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'order_id' => $order->id,
                    'amount' => $order->amount,
                    'currency' => $order->currency,
                    'key' => config('services.razorpay.key'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify payment and update donation status
     */
    public function verifyPayment(Request $request)
    {
        $validated = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        try {
            // Verify signature
            $attributes = [
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
            ];

            $this->razorpay->utility->verifyPaymentSignature($attributes);

            // Find donation by order ID
            $donation = Donation::where('razorpay_order_id', $validated['razorpay_order_id'])->firstOrFail();

            // Fetch payment details
            $payment = $this->razorpay->payment->fetch($validated['razorpay_payment_id']);

            // Update donation status
            $donation->update([
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
                'status' => 'success',
                'payment_method' => $payment->method ?? null,
                'payment_response' => json_encode($payment->toArray()),
                'payment_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'data' => [
                    'donation_id' => $donation->id,
                    'status' => $donation->status,
                ],
            ]);
        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            Log::error('Payment verification failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed',
                'error' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            Log::error('Payment verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during payment verification',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle payment failure
     */
    public function paymentFailed(Request $request)
    {
        $validated = $request->validate([
            'razorpay_order_id' => 'required|string',
            'error' => 'nullable|array',
        ]);

        try {
            $donation = Donation::where('razorpay_order_id', $validated['razorpay_order_id'])->firstOrFail();

            $donation->update([
                'status' => 'failed',
                'payment_response' => json_encode($validated['error'] ?? []),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment failure recorded',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
