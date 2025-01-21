import { FC, useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";
import { useAppDispatch } from "../redux/hooks";
import {
  updateNewList,
  updateFeaturedList,
} from "../redux/features/productSlice";
import { Product } from "../models/Product";
import LatestProducts from "../components/LatestProducts";
import Banner from "../components/Banner";

const Home: FC = () => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://ministerial-inger-asim-3f191a31.koyeb.app/product/getproduct"
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("API Response:", data);

        // Extract products from the API response
        const productList: Product[] = data.data.map((product: any) => {
          if (
            !product._id ||
            !product.name ||
            !product.image ||
            !product.price ||
            !product.description
          ) {
            console.warn(`Invalid product data:`, product);
            return null;
          }
          return {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            description: product.description,
          };
        }).filter((item: Product | null): item is Product => item !== null);

        setProducts(productList);

        // Dispatch actions to update the Redux store
        dispatch(updateFeaturedList(productList.slice(0, 8))); // First 8 products as featured
        dispatch(updateNewList(productList)); // All products as new
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="dark:bg-slate-800">
      <HeroSection />
      <Features />
      <TrendingProducts />
      <Banner />
      <LatestProducts />
      <br />
    </div>
  );
};

export default Home;
