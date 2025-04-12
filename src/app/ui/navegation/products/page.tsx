// src/app/products/product-management/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Filter, FilterByPrice } from '../products/filter'; // comment

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
  rating?: number;
};

const generateRandomRating = () => Math.floor(Math.random() * 5) + 1;

const ProductManagementPage = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [filterIdValue, updateCategoryIdFilter] = useState(0);

  const filteredProductList = products.filter((product) => {
    if(filterIdValue == 1000) {
      return product.category_id == 1000
    } 
    else if (filterIdValue == 2000) {
      return product.category_id == 2000
    }
    else if (filterIdValue == 3000) {
      return product.category_id == 3000
    }
    else if (filterIdValue == 4000) {
      return product.category_id == 4000
    }
    else if (filterIdValue == 5000) {
      return product.category_id == 5000
    }
    else if(filterIdValue == 100) {
      return product.price <= 20
    } 
    else if (filterIdValue == 200) {
      return product.price <= 50
    }
    else if (filterIdValue == 300) {
      return product.price <= 100
    }
    else if (filterIdValue == 400) {
      return product.price > 100
    }
    else {
      return product
    }
  });

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

  useEffect(() => {
    if (products.length > 0) {
      const productsWithRatings = products.map((product) => ({
        ...product,
        rating: generateRandomRating(), //assign random rating
      }));
      setProducts(productsWithRatings); //update product with random rating
    }
  }, [products.length]);

  function onFilterValueSelected(filterValue: any) {
    updateCategoryIdFilter(filterValue)
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <section className="py-6 px-6 bg-white shadow-md mb-6">
        <h2 className="text-3xl font-bold text-center mb-6 mt-6">Product Management</h2>
        <div className="flex">
          <div className="bg-blue-500 text-white mr-12 p-3 rounded-lg">
            <h3>Filter by Category</h3>
            <Filter filterValueSelected={onFilterValueSelected}></Filter>
          </div>
          <div className="bg-blue-500 text-white p-3 rounded-lg">
            <h3>Filter by Price</h3>
            <FilterByPrice filterValueSelected={onFilterValueSelected}></FilterByPrice>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProductList.map((product) => (
            <div key={product.id} className="bg-white p-6 shadow-lg rounded-lg">
              <div className="flex flex-col items-center text-center mb-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-gray-700 mb-4">Available Quantity: {product.stock_quantity}</p>
                <p className="text-lg font-semibold text-blue-500">
                  Price: ${Number(product.price).toFixed(2)}
                </p>

                {product.rating && (
                  <p className="text-lg font-semibold text-yellow-500">Rating: {product.rating} / 5</p>
                )}
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
