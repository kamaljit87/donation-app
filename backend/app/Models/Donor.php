<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'age',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'pan_number',
        'anonymous',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'anonymous' => 'boolean',
        'age' => 'integer',
    ];

    /**
     * Get the donations for the donor.
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
