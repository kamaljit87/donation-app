<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Send email (update to your real recipient)
            Mail::raw(
                "Name: {$request->name}\nEmail: {$request->email}\nPhone: {$request->phone}\nSubject: {$request->subject}\nMessage: {$request->message}",
                function ($msg) use ($request) {
                    $msg->to('write2us@annakshetra.org')
                        ->subject('New Contact Inquiry: ' . $request->subject);
                }
            );
        } catch (\Exception $e) {
            Log::error('Contact form failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully!'
        ]);
    }
}
