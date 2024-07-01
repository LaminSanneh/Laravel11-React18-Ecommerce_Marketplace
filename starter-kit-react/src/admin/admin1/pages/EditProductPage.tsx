import React, { useState, useEffect } from 'react';
import { Product } from './AdminProducts';
import { useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

const EditProductPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    // const productId = match.params.id;
    const route = useParams();
    const productId = route.id;

    useEffect(() => {
        if (!productId) {
            return;
        }

        // Fetch product data by ID
        const fetchProduct = async () => {
            // const response = await fetch(`/api/products/${productId}`);
            // const data = await response.json();
            // const data = generateMockProducts(50)[productId-1];
            const data = generateMockProducts(50)[Number(productId) - 1];
            setProduct(data);
        };

        fetchProduct();
    }, [productId]);

    const generateMockProducts = (count: number) => {
        const products = [];
        for (let i = 1; i <= count; i++) {
          const product = {
            id: i,
            name: `Product ${i}`,
            price: (Math.random() * 100).toFixed(2), // Random price between 0 and 100
            category: `Category ${Math.floor(Math.random() * 5) + 1}`, // Random category
            stock: Math.floor(Math.random() * 100), // Random stock quantity
            variants: [],
            images: [],
            categories: []
          };
          products.push(product);
        }
        return products;
      };

    const handleSave = (productData) => {
        // API call to update product
        console.log('Updating product:', productData);
    };

    if (!product) {
        return <div>...Loading</div>
    }

    return (
        <div className="container mx-auto">
            {/* <h1 className="text-2xl font-bold mb-4">Edit Product</h1> */}
            {product ? <ProductForm initialProduct={product} onSave={handleSave} /> : <p>Loading...</p>}
        </div>
    );
};

export default EditProductPage;
