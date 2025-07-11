'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  discount: number | null;
  categories: { id: number; name: string }[];
}

interface Category {
  id: number;
  name: string;
}

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{ [key: number]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch all categories
        const categoryResponse = await axios.get<Category[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const fetchedCategories = categoryResponse.data || [];
        setCategories(fetchedCategories);

        // Fetch products for each category
        const productsMap: { [key: number]: Product[] } = {};
        await Promise.all(
          fetchedCategories.map(async (category) => {
            const productResponse = await axios.get<Product[]>(
              `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category.id}`,
            );
            productsMap[category.id] = productResponse.data || [];
          }),
        );
        setProductsByCategory(productsMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories or products:', error);
        setCategories([]);
        setProductsByCategory({});
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 ">
              {productsByCategory[category.id]?.length > 0 ? (
                productsByCategory[category.id].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-gray-500">No products found in this category.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No categories available.</p>
      )}
    </div>
  );
};

export default HomePage;