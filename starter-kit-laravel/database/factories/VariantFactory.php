<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class VariantFactory extends Factory
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
            'product_id' => function () {
                return factory(Product::class)->create()->id;
            },
            'type' => $faker->word,
            'name' => $faker->word,
            'price' => $faker->randomFloat(2, 5, 50),
            'stock' => $faker->numberBetween(0, 50),
        ];
    }
}
