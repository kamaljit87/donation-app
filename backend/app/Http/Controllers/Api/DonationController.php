<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    /**
     * Store a new donation (create donor and donation record)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:1|max:120',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'pan_number' => 'nullable|string|max:10',
            'anonymous' => 'nullable|boolean',
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string|max:3',
            'donation_type' => 'nullable|string|in:one-time,monthly',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'tax_exemption_certificate' => 'nullable|boolean',
        ]);

        try {
            DB::beginTransaction();

            // Create or update donor
            $donor = Donor::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'phone' => $validated['phone'] ?? null,
                    'age' => $validated['age'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'city' => $validated['city'] ?? null,
                    'state' => $validated['state'] ?? null,
                    'country' => $validated['country'] ?? 'India',
                    'pincode' => $validated['pincode'] ?? null,
                    'pan_number' => $validated['pan_number'] ?? null,
                    'anonymous' => $validated['anonymous'] ?? false,
                ]
            );

            // Create donation record
            $donation = Donation::create([
                'donor_id' => $donor->id,
                'amount' => $validated['amount'],
                'currency' => $validated['currency'] ?? 'INR',
                'donation_type' => $validated['donation_type'] ?? 'one-time',
                'purpose' => $validated['purpose'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'tax_exemption_certificate' => $validated['tax_exemption_certificate'] ?? false,
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Donation record created successfully',
                'data' => [
                    'donation_id' => $donation->id,
                    'donor_id' => $donor->id,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create donation record',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all donations (admin only)
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Donation::with('donor')
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('donor', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $donations = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $donations,
        ]);
    }

    /**
     * Get a specific donation (admin only)
     */
    public function show($id)
    {
        $donation = Donation::with('donor')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $donation,
        ]);
    }

    /**
     * Get donation statistics (admin only)
     */
    public function statistics()
    {
        $stats = [
            'total_donations' => Donation::where('status', 'success')->sum('amount'),
            'total_donors' => Donor::count(),
            'total_transactions' => Donation::count(),
            'successful_donations' => Donation::where('status', 'success')->count(),
            'pending_donations' => Donation::where('status', 'pending')->count(),
            'failed_donations' => Donation::where('status', 'failed')->count(),
            'recent_donations' => Donation::with('donor')
                ->where('status', 'success')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
