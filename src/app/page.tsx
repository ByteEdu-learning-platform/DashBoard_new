"use client";

import { apiClient, ProductFormData } from "@/lib/api-client";
import { IProduct } from "@/models/Product";
import { useEffect, useState } from "react";
import { Types } from "mongoose";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const data: ProductFormData[] = await apiClient.getProducts(); // Ensure data is of type IProduct[]
        const productsList: IProduct[] = data.map((product) => ({
          ...product,
          _id: new Types.ObjectId(),
          createdAt: product.createdAt
            ? new Date(product.createdAt)
            : new Date(),
          updatedAt: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchproducts();
  }, []); // Added an empty dependency array to avoid re-fetching on every render

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id.toString()}
            className="card bg-base-100 shadow-md p-4 rounded-md"
          >
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-lg font-bold">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
