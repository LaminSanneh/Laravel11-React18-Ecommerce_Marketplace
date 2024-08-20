<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getExistingCategories()
    {
//        return response()->json(Category::all()->pluck('name')->toArray());
        return response()->json(Category::all()->select('id', 'name')->toArray());
    }
}
