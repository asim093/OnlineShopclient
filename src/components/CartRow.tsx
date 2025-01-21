import { FC } from "react";
import { CartItem } from "../models/CartItem";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { useAppDispatch } from "../redux/hooks";
import {
  addToCart,
  reduceFromCart,
  removeFromCart,
} from "../redux/features/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import useDiscount from "../hooks/useDiscount";

const CartRow: FC<CartItem> = ({
  _id,
  image,
  name,
  price,
  quantity,
  discountPercentage = 0,
}) => {
  const dispatch = useAppDispatch();
  const result = useDiscount({ price, discount: discountPercentage });

  return (
    <div className="grid grid-cols-7 gap-3 border items-center">
      <img src={image} alt="thumbnail" className="h-20 col-span-2" />
      <div className="col-span-3">
        <h3 className="font-bold leading-4">{name}</h3>
        <div className="flex space-x-2 items-center">
          <h3 className="font-semibold">${result.toFixed(2)}</h3>
          {discountPercentage !== 0 && (
            <span className="text-xs">-{discountPercentage}%</span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <IoIosRemoveCircleOutline
            className="cursor-pointer hover:opacity-80"
            onClick={() => dispatch(reduceFromCart(_id))}
            data-test="cart-reduce-btn"
          />
          <span data-test="cart-item-quantity">{quantity}</span>
          <IoIosAddCircleOutline
            className="cursor-pointer hover:opacity-80"
            data-test="cart-increase-btn"
            onClick={() =>
              dispatch(
                addToCart({
                  _id,
                  name,
                  price,
                  quantity,
                  image,
                })
              )
            }
          />
        </div>
      </div>
      <div className="font-bold col-span-2">
        {quantity && (
          <span data-test="cart-item-price">
            Rs:{(result * quantity).toFixed(0)}
          </span>
        )}
        <RiDeleteBin6Line
          className="text-red-500 cursor-pointer text-2xl hover:text-red-600"
          onClick={() => dispatch(removeFromCart(_id))}
          data-test="cart-remove-btn"
        />
      </div>
    </div>
  );
};

export default CartRow;
