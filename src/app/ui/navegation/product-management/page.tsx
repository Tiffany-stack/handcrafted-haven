// src/app/products/product-management/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define types for product and product images
type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
};

type ProductWithImages = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  created_at: string;
  images: ProductImage[];
};

const ProductManagementPage = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);

  // Fetch products from the backend (adjust the URL as needed)
  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      console.error("Error: Data is not an array", data);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-6 px-6 bg-white shadow-md mb-6">
        <h2 className="text-3xl font-bold text-center mb-6">Product Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 shadow-lg rounded-lg">
              <div className="flex flex-col items-center text-center mb-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-gray-700 mb-4">Available Quantity: {product.stock_quantity}</p>
                <p className="text-lg font-semibold text-blue-500">Price: ${product.price}</p>
              </div>
              <div className="mt-4">
                {/* Display all product images */}
                {(product.images || []).map((image) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mt-2"
                  />
                ))}
              </div>
              <div className="mt-4">
                {/* Change button text to 'Add to Cart' */}
                <button className="w-full py-2 bg-blue-500 text-white rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductManagementPage;