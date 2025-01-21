import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { addToCart } from "../redux/features/cartSlice";
import { useAppDispatch } from "../redux/hooks";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import PriceSection from "./PriceSection";
import useAuth from "../hooks/useAuth";

const ProductCard: FC<Product> = ({
  _id,
  price,
  image,
  name,
  discountPercentage,
}) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useAuth();

  const addCart = () => {
    requireAuth(() => {
      dispatch(
        addToCart({
          _id,
          price,
          name,
          image,
          discountPercentage,
        })
      );
      toast.success("Item added to cart successfully", {
        duration: 3000,
      });
    });
  };

  const imageSrc =
    typeof image === "string"
      ? image // Use the string directly
      : Array.isArray(image)
      ? image[0] // Use the first image in the array
      : "placeholder.jpg"; // Fallback if image is undefined

  return (
    <div className="relative m-10 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
      <Link to={{ pathname: `/product/${_id}` }}>
        <img
          src={imageSrc}
          alt={name}
          className="h-60 rounded-t-lg object-cover"
        />
      </Link>
      {discountPercentage && (
        <span className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 bg-black text-center text-sm text-white">
          Sale
        </span>
      )}
      <div className="mt-4 px-5 pb-5">
        <Link to={{ pathname: `/product/${_id}` }}>
          <h5 className="text-xl font-semibold tracking-tight text-slate-900">
            {name}
          </h5>
        </Link>
        <div className="mt-2.5 mb-5 flex items-center">
          <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
            5.0
          </span>
          <RatingStar rating={5} />
        </div>
        <div className="flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">${price}</span>
            {discountPercentage && (
              <span className="text-sm text-slate-900 line-through">
                ${(price * (1 + discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </p>
          <button
            onClick={addCart}
            className="flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <AiOutlineShoppingCart className="mr-2 h-6 w-6" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
