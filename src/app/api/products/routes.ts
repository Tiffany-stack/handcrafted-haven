{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
import 'server-only';

//import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Database connection
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Data types for Product and ProductImage
type Product = {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: number;
    created_at?: string;
};

type ProductImage = {
    id?: number;
    product_id: number;
    image_url: string;
};

type ProductWithImages = Product & {
    images: ProductImage[];
};

// Functions to handle products

// Get all products
async function getProducts(): Promise<Product[]> {
    const data = await sql<Product[]>`
    SELECT id, name, description, price, stock_quantity, category_id, created_at
    FROM products;
    `;
    return data;
}

// Add a new product
async function addProduct(product: Product): Promise<Product[]> {
    const { name, description, price, stock_quantity, category_id } = product;

    const data = await sql<Product[]>`
    INSERT INTO products (name, description, price, stock_quantity, category_id)
    VALUES (${name}, ${description}, ${price}, ${stock_quantity}, ${category_id})
    RETURNING id, name, description, price, stock_quantity, category_id, created_at;
    `;
    return data;
}

// Update an existing product
async function updateProduct(id: number, product: Product): Promise<Product[]> {
    const { name, description, price, stock_quantity, category_id } = product;

    const data = await sql<Product[]>`
    UPDATE products
    SET name = ${name}, description = ${description}, price = ${price}, stock_quantity = ${stock_quantity}, category_id = ${category_id}
    WHERE id = ${id}
    RETURNING id, name, description, price, stock_quantity, category_id, created_at;
    `;
    return data;
}

// Delete a product
async function deleteProduct(id: number): Promise<Product[]> {
    const data = await sql<Product[]>`
    DELETE FROM products WHERE id = ${id} RETURNING id;
    `;
    return data;
}

// Functions to handle product images

// Get all images for a product
async function getProductImages(productId: number): Promise<ProductImage[]> {
    const data = await sql<ProductImage[]>`
    SELECT id, product_id, image_url
    FROM product_images
    WHERE product_id = ${productId};
    `;
    return data;
}

// Add an image to a product
async function addProductImage(productId: number, imageUrl: string): Promise<ProductImage[]> {
    const data = await sql<ProductImage[]>`
    INSERT INTO product_images (product_id, image_url)
    VALUES (${productId}, ${imageUrl})
    RETURNING id, product_id, image_url;
    `;
    return data;
}

// Update the URL of an image
async function updateProductImage(imageId: number, newImageUrl: string): Promise<ProductImage[]> {
    const data = await sql<ProductImage[]>`
    UPDATE product_images
    SET image_url = ${newImageUrl}
    WHERE id = ${imageId}
    RETURNING id, product_id, image_url;
    `;
    return data;
}

// Delete an image
async function deleteProductImage(imageId: number): Promise<ProductImage[]> {
    const data = await sql<ProductImage[]>`
    DELETE FROM product_images WHERE id = ${imageId} RETURNING id;
    `;
    return data;
}

// API Handler: GET, POST, PUT, DELETE

// Get products (either all or by ID)
export async function GET(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const productId = url.searchParams.get("productId");

        if (productId) {
            // Fetch a single product by its ID
            const products = await getProducts();
            const product = products.find(p => p.id === Number(productId));
            if (!product) {
                return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
            }

            // Add images to the product
            const images = await getProductImages(product.id!);
            (product as ProductWithImages).images = images;

            return new Response(JSON.stringify(product), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Fetch all products

            const products = await getProducts();
            for (const product of products) {
                const images = await getProductImages(product.id!); // Fetch images for each product
                (product as ProductWithImages).images = images;
            }

            return new Response(JSON.stringify(products), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching products' }), { status: 500 });
    }
}

// Create a new product
export async function POST(req: Request): Promise<Response> {
    try {
        const { product, imageUrl }: { product: Product, imageUrl: string } = await req.json();

        // Add the product
        const newProduct = await addProduct(product);

        // Add image if provided
        if (imageUrl) {
            await addProductImage(newProduct[0].id!, imageUrl); // Add image to the new product
        }

        return new Response(JSON.stringify(newProduct), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error adding product' }), { status: 500 });
    }
}

// Update a product
export async function PUT(req: Request): Promise<Response> {
    try {
        const { id, product, imageUrl }: { id: number, product: Product, imageUrl?: string } = await req.json();

        // Update the product
        const updatedProduct = await updateProduct(id, product);

        // Update image if a new image URL is provided
        if (imageUrl) {
            const productImages = await getProductImages(id);
            if (productImages.length > 0) {
                // Update the first image if the product has one
                await updateProductImage(productImages[0].id!, imageUrl);
            } else {
                // If no images exist, add a new one
                await addProductImage(id, imageUrl);
            }
        }

        return new Response(JSON.stringify(updatedProduct), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error updating product' }), { status: 500 });
    }
}

// Delete a product and its associated images
export async function DELETE(req: Request): Promise<Response> {
    try {
        const { id }: { id: number } = await req.json();

        // Delete all images associated with the product
        const productImages = await getProductImages(id);

        for (const image of productImages) {
            await deleteProductImage(image.id!); // Delete each associated image
        }

        // Delete the product itself
        const deletedProduct = await deleteProduct(id);
        return new Response(JSON.stringify(deletedProduct), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error deleting product' }), { status: 500 });
    }
}