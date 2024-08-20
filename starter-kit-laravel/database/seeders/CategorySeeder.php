<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DB::table('categories')->count() > 0) {
            return;
        }

        $categories = ['Shoes', 'Shirts', 'Pants', 'Toys', 'Electronics'];
        foreach ($categories as $category) {
            Category::factory()->create(['name' => $category]);
        }
    }
}
