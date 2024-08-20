<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = fake();

        return [
            'name' => $faker->sentence(3),
            'price' => $faker->randomFloat(2, 10, 100),
            'stock' => $faker->numberBetween(0, 100),
        ];
    }
}
