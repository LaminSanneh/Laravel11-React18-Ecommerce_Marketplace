<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryProductFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'category_id' => Category::factory(),
            'product_id' => Product::factory(),
        ];
    }
}

