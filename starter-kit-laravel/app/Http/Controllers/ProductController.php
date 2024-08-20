<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\Category;
use App\Models\Image;
use App\Models\Variant;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
//    public function index(Request $request)
//    {
//        $includeDeleted = $request->input('include_deleted', false);
//
//        $products = Product::query()->with([
////            'categories', 'variants', 'images'
//            ]);
//
////        load(['categories', 'variants', 'images'])
//        if (!$includeDeleted) {
//            $products->whereNull('deleted_at');
//        }
//
//        $products = $products->get();
//
//        return response()->json($products, 200);
//    }

    public function index(Request $request)
    {
//        dd($request->all());
        // Extract query parameters
        $filters = $request->input('filters', []);
        $currentPage = $request->input('currentPage', 1);
        $limit = $request->input('limit', 15);
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');

        // Build query
        $query = Product::query();

        // Apply filters
        foreach ($filters as $column => $value) {
            if ($value) {
                $query->where($column, 'like', "%{$value}%");
            }
        }

        // Sorting
        $query->orderBy($sortBy, $sortDirection);

        // Get total items count after filtering
        $totalItems = $query->count();

        // Pagination
        $products = $query->paginate($limit, ['*'], 'page', $currentPage);

        // Load relations
        $products->load(['categories', 'variants', 'images']);

        // Return response with data, totalItems, links, and meta
        return response()->json([
            'data' => $products->items(),
            'totalItems' => $totalItems,
            'links' => [
                'first' => $products->url(1),
                'last' => $products->url($products->lastPage()),
                'prev' => $products->previousPageUrl(),
                'next' => $products->nextPageUrl(),
            ],
            'meta' => [
                'currentPage' => $products->currentPage(),
                'perPage' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//        dd($request->all(), $request->allFiles());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'categories' => 'required|array',
            'categories.*.id' => 'nullable|integer|exists:categories,id',
            'categories.*.name' => 'required_without:id|string|max:255',
            'variants' => 'required|array',
            'variants.*.type' => 'required|string|max:255',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric',
            'variants.*.stock' => 'required|integer',
            'variants.*.image' => 'sometimes',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

//        $validator = Validator::make($request->all(), [
//            'name' => 'required|string|max:255',
//            'price' => 'required|numeric',
//            'stock' => 'required|integer',
//            'categories' => 'required|array',
//            'categories.*' => 'string|max:255',
//            'variants' => 'array',
//            'variants.*.type' => 'required|string|max:255',
//            'variants.*.name' => 'required|string|max:255',
//            'variants.*.price' => 'required|numeric',
//            'variants.*.stock' => 'required|integer',
//            'images' => 'required|array',
//            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
//        ]);

//        if ($validator->fails()) {
//            return response()->json($validator->errors(), 422);
//        }

        // Create product
        $product = Product::create([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'stock' => $request->input('stock'),
        ]);

        // Attach categories
        $categories = [];
//        foreach (json_decode($validated['categories'], true) as $categoryData) {
        foreach ($validated['categories'] as $categoryData) {
            if (isset($categoryData['id'])) {
                $category = Category::find($categoryData['id']);
            } else {
                $category = Category::firstOrCreate(['name' => $categoryData['name']]);
            }
//            $category = Category::firstOrCreate(['name' => $categoryName]);
            $categories[] = $category->id;
        }
        $product->categories()->sync($categories);

        // Upload and attach images
//        if ($request->hasFile('images')) {
        if (isset($validated['images'])) {
//            $uploadedImages = [];
            foreach ($validated['images'] as $image) {
                $path = $image->store('images', 'public');
//                $uploadedImages[] = ['path' => $path];
                $product->images()->create(['path' => $path]);
            }
//            $product->images()->createMany($uploadedImages);
        }

        // Create variants
        if (isset($validated['variants'])) {
//            foreach (json_decode($validated['variants'], true) as $variantData) {
//            foreach ($validated['variants'] as $variantData) {
//                $product->variants()->create([
//                    'type' => $variantData['type'],
//                    'name' => $variantData['name'],
//                    'price' => $variantData['price'],
//                    'stock' => $variantData['stock'],
//                ]);
//            }
            
            foreach ($validated['variants'] as $variantData) {
                if (isset($variantData['image']) && is_file($variantData['image'])) {
                    $path = $variantData['image']->store('variant_images', 'public');
                    $variantData['image'] = $path;
                }

//                $variant->product_id = $pro
                $product->variants()->create([
                    'type' => $variantData['type'],
                    'name' => $variantData['name'],
                    'price' => $variantData['price'],
                    'stock' => $variantData['stock'],
                    'image' => $variantData['image']
                ]);
//                $variant = new Variant($variantData);
//                $product->variants()->save($variant);
            }
        }

        $product->load(['categories', 'variants', 'images']);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with(['categories', 'variants', 'images'])->findOrFail($id);

//        $product->load(['categories', 'variants', 'images']);

        return response()->json($product, 200);
    }

    public function update(Request $request, Product $product)
    {
        // $request->dd();
    //    dd($request->all());
    // return $request->allFiles();
    // return is_file($request->variants[0]['image']);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'categories' => 'required|array',
            'categories.*.id' => 'nullable|integer|exists:categories,id',
            'categories.*.name' => 'required_without:id|string|max:255',
            'variants' => 'required|array',
            'variants.*.id' => 'sometimes|integer|exists:variants,id',
            'variants.*.type' => 'required|string|max:255',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric',
            'variants.*.stock' => 'required|integer',
            'variants.*.image' => 'sometimes',
            'images_to_remove' => 'nullable|array',
            'images_to_remove.*' => 'integer|exists:images,id',
            'images' => 'sometimes|array',
            'images.*' => 'file|image|max:2048',
        ]);

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        // Attach or create categories
        $product->categories()->detach();
        // foreach (json_decode($validated['categories'], true) as $categoryData) {
        foreach ($validated['categories'] as $categoryData) {
            if (isset($categoryData['id'])) {
                $category = Category::find($categoryData['id']);
            } else {
                $category = Category::firstOrCreate(['name' => $categoryData['name']]);
            }
            $product->categories()->attach($category);
        }

        // Update variants
//        $product->variants()->delete();
        // foreach (json_decode($validated['variants'], true) as $variantData) {
        foreach ($validated['variants'] as $variantData) {
            if (isset($variantData['id'])) {
                $variant = Variant::find($variantData['id']);
                
                if (isset($variantData['image']) && is_file($variantData['image'])) {
                    $path = $variantData['image']->store('variant_images', 'public');
                    
                    if ($variant && $variant->image) {
                        Storage::disk('public')->delete($variant->image);
                    }

                    $variantData['image'] = $path;
                    $variant->update($variantData);
                } else if (!isset($variantData['image']) || (is_null($variantData['image']))) {
                    $variantData['image'] = '';
                    
                    if ($variant && $variant->image) {
                        Storage::disk('public')->delete($variant->image);
                    }

                    $variant->update($variantData);
                }
                
            } else {
                if (isset($variantData['image']) && is_file($variantData['image'])) {
                    $path = $variantData['image']->store('variant_images', 'public');
                    $variantData['image'] = $path;
                }
                
//                $variant->product_id = $pro
                $variant = new Variant($variantData);
                $product->variants()->save($variant);
            }
        }

        // Remove specified images
        if (isset($validated['images_to_remove'])) {
            foreach ($validated['images_to_remove'] as $imageId) {
                $image = $product->images()->find($imageId);
                if ($image) {
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                }
            }
        }

        // Upload new images
        if (isset($validated['images'])) {
            foreach ($validated['images'] as $image) {
                $path = $image->store('images', 'public');
                $product->images()->create(['path' => $path]);
            }
        }

        // Load the relations
        $product->load(['categories', 'variants', 'images']);

        // Return the response with specified properties and relations
        return response()->json($product);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Soft delete product
        $product->delete();

        return response()->json(null, 204);
    }
}
