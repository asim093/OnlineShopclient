import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";

const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const sortRef = useRef<HTMLSelectElement>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const allProducts = useAppSelector(
    (state) => state.productReducer.allProducts
  );

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = () => {
      fetch("https://ministerial-inger-asim-3f191a31.koyeb.app/product/getproduct")
        .then((res) => res.json())
        .then((response) => {
          const { data } = response; // Adjust this line to extract 'data'
          if (Array.isArray(data)) {
            dispatch(addProducts(data)); // Use 'data' if it's an array
          } else {
            console.error("Unexpected response structure:", data);
          }
        })
        .catch((error) => console.error("Error fetching products:", error));
    };

    fetchProducts();
  }, [dispatch]);

  // Update current products when allProducts changes in Redux store
  useEffect(() => {
    console.log("allProducts from Redux:", allProducts);
    if (Array.isArray(allProducts)) {
      setCurrentProducts(allProducts);
    }
  }, [allProducts]);

  // Sort products based on selected option
  const sortProducts = (sortValue: string) => {
    if (sortValue === "asc") {
      setCurrentProducts(
        [...currentProducts].sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return aPrice - bPrice;
        })
      );
    } else if (sortValue === "desc") {
      setCurrentProducts(
        [...currentProducts].sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return bPrice - aPrice;
        })
      );
    } else {
      setCurrentProducts([...currentProducts].sort((a, b) => a._id - b._id));
    }
  };

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">Products</span>
            <select
              ref={sortRef}
              className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
              onChange={(e) => sortProducts(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="asc">Price (low to high)</option>
              <option value="desc">Price (high to low)</option>
            </select>
          </div>
          <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product._id} {...product} />
              ))
            ) : (
              <div className="text-center dark:text-white">
                No products available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
