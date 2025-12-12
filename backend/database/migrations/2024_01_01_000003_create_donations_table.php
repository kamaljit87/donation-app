<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donor_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('INR');
            $table->string('donation_type')->default('one-time'); // one-time, monthly
            $table->string('purpose')->nullable(); // mid-day-meals, education, etc.
            $table->string('payment_method')->nullable(); // razorpay, card, upi, etc.
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('razorpay_signature')->nullable();
            $table->text('payment_response')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('tax_exemption_certificate')->default(false);
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('razorpay_order_id');
            $table->index('razorpay_payment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
