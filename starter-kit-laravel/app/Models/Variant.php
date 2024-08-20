<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class Variant extends Model
{
//    use SoftDeletes;
    use HasFactory;

    protected $fillable = ['product_id', 'type', 'name', 'price', 'stock', 'image'];
    
    public $appends = [
        'image_url'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    protected function imageUrl(): Attribute {
        return Attribute::make(get: fn () => url("/storage/{$this->attributes['image']}"));
    }
}