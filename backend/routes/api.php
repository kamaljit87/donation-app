<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Donation routes (public)
Route::post('/donations', [DonationController::class, 'store']);

// Payment routes (public)
Route::post('/payment/create-order', [PaymentController::class, 'createOrder']);
Route::post('/payment/verify', [PaymentController::class, 'verifyPayment']);
Route::post('/payment/failed', [PaymentController::class, 'paymentFailed']);

// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // Admin donation management
    Route::get('/admin/donations', [DonationController::class, 'index']);
    Route::get('/admin/donations/{id}', [DonationController::class, 'show']);
    Route::get('/admin/statistics', [DonationController::class, 'statistics']);
});
