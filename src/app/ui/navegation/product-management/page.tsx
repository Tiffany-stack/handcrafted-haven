'use client';

import React, { useState, useEffect } from 'react';

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
};
{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
type ProductWithImages = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  created_at: string;
  images: ProductImage[];  // Add images associated with the product
};

const ProductPage = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [formData, setFormData] = useState({
    id: 0,  
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: 0,
    imageUrl: ''
  });

  // Fetch all products from the API
  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    console.log(data);  // Check what the data contains

    if (Array.isArray(data)) {
      setProducts(data);  // Only update if it's an array
    } else {
      console.error("Error: data is not an array", data);
    }
  };

  // Fetch product data if editing an existing product
  const fetchProductById = async (id: number) => {
    const res = await fetch(`/api/products?productId=${id}`);
    const data = await res.json();
    if (data && data.id) {
      setFormData({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stock_quantity: data.stock_quantity,
        category_id: data.category_id,
        imageUrl: data.images.length > 0 ? data.images[0].image_url : '',  // Set the first image URL
      });
    }
  };

  // Fetch products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If it's a select (like category_id),it converts the value to an integer
    if (e.target instanceof HTMLSelectElement) {
      setFormData((prevData) => ({ ...prevData, [name]: parseInt(value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission for adding a new product or updating an existing one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = formData.id ? `/api/products` : '/api/products';  // API endpoint (same for both POST and PUT)
    const method = formData.id ? 'PUT' : 'POST';  // If id exists, it's an update (PUT), otherwise create (POST)

    const res = await fetch(url, {
      method: method,
      body: JSON.stringify({
        id: formData.id,  // Ensure id is passed in the body for PUT
        product: formData,
        imageUrl: formData.imageUrl,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (method === 'PUT') {
      // Update the product in the list
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === formData.id ? result : product))
      );
    } else {
      // Add the new product to the list
      setProducts((prevProducts) => [...prevProducts, result]);
    }

    setFormData({
      id: 0,
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category_id: 0,
      imageUrl: ''
    });
  };

  // Handle editing a product (you can add a click handler to each product)
  const handleEdit = (product: ProductWithImages) => {
    fetchProductById(product.id);
  };

  // Handle deleting a product
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(`/api/products`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (res.ok) {
        // Remove the deleted product from the state
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } else {
        console.error("Error deleting product:", result);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full h-40 md:h-60 bg-[url(./heroImage.jpg)] bg-cover bg-center rounded-t-lg text-center py-24">
        <h1 className="text-5xl font-bold text-white mb-4">Manage Your Products</h1>
        <p className="text-xl text-white mb-8">Add, Update, and Manage your products easily.</p>
      </section>

      {/* Product Form Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">{formData.id ? 'Update Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 shadow-lg rounded-lg">
          <div>
            <label className="block text-lg font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter product description"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter product price"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter product stock quantity"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value={0}>Select a category</option>
              <option value={1000}>Handcrafted Jewelry</option>
              <option value={2000}>Ceramics</option>
              <option value={3000}>Bags</option>
              <option value={4000}>Lamps</option>
              <option value={5000}>Decorations</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Product Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-lg">{formData.id ? 'Update Product' : 'Add Product'}</button>
          </div>
        </form>
      </section>

      {/* Display Products */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-lg font-semibold text-blue-500">${product.price}</p>
              <div className="mt-4">
                {(product.images || []).map((image) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mt-2"
                  />
                ))}
              </div >
              <div className='mt-4 flex space-x-4'>
                <button onClick={() => handleEdit(product)} className="mt-4 text-blue-500">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="mt-4 text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;