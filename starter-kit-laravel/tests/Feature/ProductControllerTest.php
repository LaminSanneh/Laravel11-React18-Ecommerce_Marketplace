<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_a_product()
    {
        Storage::fake('public'); // Use fake storage for testing

        $categories = Category::factory(3)->create()->pluck('name')->toArray();
        $images = [
            UploadedFile::fake()->image('image1.jpg'),
            UploadedFile::fake()->image('image2.jpg'),
        ];

        $response = $this->postJson(route('products.store'), [
            'name' => 'Test Product',
            'price' => 49.99,
            'stock' => 100,
            'categories' => $categories,
            'variants' => [
                ['type' => 'Size', 'name' => 'XL', 'price' => 59.99, 'stock' => 50],
                ['type' => 'Size', 'name' => 'L', 'price' => 49.99, 'stock' => 50],
            ],
            'images' => $images,
        ]);

//        $response->dd();
        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'price',
                'stock',
                'created_at',
                'updated_at',
                'categories',
                'variants',
                'images',
            ]);

        $productId = $response->json('id');
        $this->assertCount(3, Product::find($productId)->categories);
        $this->assertCount(2, Product::find($productId)->variants);
        $this->assertCount(2, Product::find($productId)->images);
    }

    public function test_can_update_a_product()
    {
        $product = Product::factory()->has(Variant::factory()->count(1))->create();
//        $product->variiant()->create(\App\Models\Variant::factory()->create('product_id'));

        $categories = Category::factory(2)->create()->pluck('name')->toArray();
        $images = [
            UploadedFile::fake()->image('updated_image1.jpg'),
        ];
        
        $existingImage = Image::factory()->create(['product_id' => $product->id]);
        
//        $imageIds = [
//            $images[0]->name => $imageInDb->id
//        ];
        
//        dd($images, $imageIds);
        
        $updatePayload = [
            'name' => 'Updated Product',
            'price' => 59.99,
            'stock' => 150,
            'categories' => $categories,
            'variants' => [
//                [
//                    'type' => 'Color',
//                    'name' => 'Red',
//                    'price' => 15,
//                    'stock' => 50,
//                ]
                ['id' => $product->variants->first()->id, 'type' => 'Size', 'name' => 'XXL', 'price' => 69.99, 'stock' => 70],
                ['type' => 'Size', 'name' => 'M', 'price' => 39.99, 'stock' => 80],
            ],
            'images_to_remove' => [$existingImage->id],
            'images' => [
                UploadedFile::fake()->image('image3.jpg'),
                UploadedFile::fake()->image('image4.jpg')
            ],
        ];

        $response = $this->putJson(route('products.update', $product->id), 
                $updatePayload
//                [
//            'name' => 'Updated Product',
//            'price' => 59.99,
//            'stock' => 150,
//            'categories' => $categories,
//            'variants' => [
//                ['id' => $product->variants->first()->id, 'type' => 'Size', 'name' => 'XXL', 'price' => 69.99, 'stock' => 70],
//                ['type' => 'Size', 'name' => 'M', 'price' => 39.99, 'stock' => 80],
//            ],
//            'images' => $images,
//            'image_ids' => $imageIds
//        ]
                );

//        $response->dd();
        $response->assertStatus(200)
            ->assertJson([
                'id' => $product->id,
                'name' => 'Updated Product',
                'price' => 59.99,
                'stock' => 150,
            ]);
        
        $response->assertJsonStructure([
            'id',
            'name',
            'price',
            'stock',
            'created_at',
            'updated_at',
            'deleted_at',
            'categories' => [
                '*' => ['id', 'name']
            ],
            'variants' => [
                '*' => ['id', 'type', 'name', 'price', 'stock']
            ],
            'images' => [
                '*' => ['id', 'path']
            ]
        ]);

        $this->assertCount(2, $product->fresh()->categories);
        $this->assertCount(2, $product->fresh()->variants);
        $this->assertCount(2, $product->fresh()->images);
    }

    public function test_can_soft_delete_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson(route('products.destroy', $product->id));

        $response->assertStatus(204);
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }
    
    /**
     * @dataProvider invalidProductDataProvider
     */
    public function testStoreProductValidation($payload, $missingField)
    {
        $response = $this->postJson('/api/products', $payload);

//        $response->dd();
        $response->assertStatus(422);
//        dd($response->json());
        $response->assertJsonValidationErrors($missingField);
    }

    /**
     * @dataProvider validProductDataProvider
     */
    public function testStoreProduct($payload)
    {
        $response = $this->postJson('/api/products', $payload);

//        $response->dd();
        $response->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'name' => $payload['name'],
            'price' => $payload['price'],
            'stock' => $payload['stock'],
        ]);

        foreach ($payload['categories'] as $category) {
            $this->assertDatabaseHas('categories', [
                'name' => $category,
            ]);
        }

        foreach ($payload['variants'] as $variant) {
            $this->assertDatabaseHas('variants', [
                'type' => $variant['type'],
                'name' => $variant['name'],
                'price' => $variant['price'],
                'stock' => $variant['stock'],
            ]);
        }

//        foreach ($payload['images'] as $image) {
//            $this->assertDatabaseHas('images', [
//                'path' => $image->name,
//            ]);
//        }
        $this->assertDatabaseCount('images', 2);
//        $this->assertCount(2, $product->fresh()->images);
        
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'name',
            'price',
            'stock',
            'created_at',
            'updated_at',
            'categories' => [
                '*' => ['id', 'name']
            ],
            'variants' => [
                '*' => ['id', 'type', 'name', 'price', 'stock']
            ],
            'images' => [
                '*' => ['id', 'path']
            ]
        ]);
    }
    
    /**
     * @dataProvider validProductDataProvider
     */
    public function testShowProduct($payload)
    {
        // Create a product
        $product = Product::create([
            'name' => $payload['name'],
            'price' => $payload['price'],
            'stock' => $payload['stock'],
        ]);

        // Attach categories
        foreach ($payload['categories'] as $categoryName) {
            $category = Category::firstOrCreate(['name' => $categoryName]);
            $product->categories()->attach($category);
        }

        // Create variants
        foreach ($payload['variants'] as $variantData) {
            $variant = new Variant($variantData);
            $product->variants()->save($variant);
        }

        // Simulate image upload and attach images to product
        foreach ($payload['images'] as $image) {
            $product->images()->create(['path' => $image->name]);
        }

        $response = $this->getJson('/api/products/' . $product->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'price',
            'stock',
            'created_at',
            'updated_at',
            'deleted_at',
            'categories' => [
                '*' => ['id', 'name']
            ],
            'variants' => [
                '*' => ['id', 'type', 'name', 'price', 'stock']
            ],
            'images' => [
                '*' => ['id', 'path']
            ]
        ]);
        
        $this->assertDatabaseCount('images', 2);
        $this->assertDatabaseCount('variants', 1);
        $this->assertDatabaseCount('categories', 2);
    }

    /**
     * @dataProvider invalidProductDataProvider
     */
    public function testUpdateProductValidation($payload, $missingField)
    {
        $product = Product::factory()->create();
        
        $response = $this->putJson('/api/products/' . $product->id, $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors($missingField);
    }

    /**
     * @dataProvider validProductDataProvider
     */
    public  function testUpdateProduct($payload)
    {
        $product = Product::factory()->create();
        
        $response = $this->putJson('/api/products/' . $product->id, $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => $payload['name'],
            'price' => $payload['price'],
            'stock' => $payload['stock'],
        ]);

        foreach ($payload['categories'] as $category) {
            $this->assertDatabaseHas('categories', [
                'name' => $category,
            ]);
        }

        foreach ($payload['variants'] as $variant) {
            $this->assertDatabaseHas('variants', [
                'type' => $variant['type'],
                'name' => $variant['name'],
                'price' => $variant['price'],
                'stock' => $variant['stock'],
            ]);
        }
        
//        foreach ($payload['images'] as $image) {
//            $this->assertDatabaseHas('images', [
//                'path' => $image->name,
//            ]);
//        }
        $this->assertDatabaseCount('images', 2);
        
        $response->assertJsonStructure([
            'id',
            'name',
            'price',
            'stock',
            'created_at',
            'updated_at',
            'deleted_at',
            'categories' => [
                '*' => ['id', 'name']
            ],
            'variants' => [
                '*' => ['id', 'type', 'name', 'price', 'stock']
            ],
            'images' => [
                '*' => ['id', 'path']
            ]
        ]);
    }

    public static function invalidProductDataProvider()
    {
        return [
            'missing name' => [
                [
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'name'
            ],
            'missing price' => [
                [
                    'name' => 'prod Name',
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'price'
            ],
            'missing stock' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'stock'
            ],
            'missing categories' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'categories'
            ],
            'missing variant type' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'variants.0.type'
            ],
            'missing variant name' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'variants.0.name'
            ],
            'missing variant price' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'variants.0.price'
            ],
            'missing variant stock' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image.jpg')
                    ],
                ],
                'variants.0.stock'
            ],
            'missing images' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                ],
                'images'
            ]
        ];
    }

    public static function validProductDataProvider()
    {
        return [
            'valid product' => [
                [
                    'name' => 'prod Name',
                    'price' => 23,
                    'stock' => 233,
                    'categories' => ['Category B', 'Custom Category'],
                    'variants' => [
                        [
                            'type' => 'Size',
                            'name' => 'XL',
                            'price' => 12,
                            'stock' => 22,
                        ]
                    ],
                    'images' => [
                        UploadedFile::fake()->image('image1.jpg'),
                        UploadedFile::fake()->image('image2.jpg')
//                        'image1.jpg',
//                        'image2.jpg'
                    ],
                ],
            ],
        ];
    }
}
