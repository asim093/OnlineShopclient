import { useEffect, useState } from "react";
import { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setCartState } from "../redux/features/cartSlice";
import { updateModal } from "../redux/features/authSlice";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import CustomPopup from "./CustomPopup";
import { updateDarkMode } from "../redux/features/homeSlice";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(
    (state) => state.cartReducer.cartItems.length
  );
  const username = useAppSelector((state) => state.authReducer.username);
  const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);
  const { requireAuth } = useAuth();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileimage, Setprofileimage] = useState<string | null>("");

  const showCart = () => {
    requireAuth(() => dispatch(setCartState(true)));
  };
  const image = localStorage.getItem("profileimage");
  useEffect(() => {
    if (image) {
      Setprofileimage(image);
    } else {
      Setprofileimage(null); 
    }
  }, [image]); 
  

  return (
    <div className="py-4 bg-white dark:bg-slate-800 top-0 sticky z-10 shadow-lg font-karla">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-bold dark:text-white"
            data-test="main-logo"
          >
            Online Shop
          </Link>

          {/* Search Bar - Hidden on small screens */}
          <div className="lg:flex hidden w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Search for a product..."
              className="border-2 border-blue-500 px-6 py-2 w-full dark:text-white dark:bg-slate-800"
            />
            <div className="bg-blue-500 text-white text-[26px] grid place-items-center px-4">
              <BsSearch />
            </div>
          </div>

          {/* Navigation Links and Actions */}
          <div className="hidden md:flex gap-4 md:gap-8 items-center dark:text-white">
            <Link
              to="/products"
              className="text-xl font-bold"
              data-test="main-products"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-xl font-bold"
              data-test="main-categories"
            >
              Categories
            </Link>
            <div className="flex items-center gap-2">
              {username || profileimage  ? (
                <img
                  src={profileimage || undefined}
                  alt="avatar"
                  className="w-8 rounded-3xl"
                />
              ) : (
                <FaUser className="text-gray-500 text-2xl dark:text-white" />
              )}
              <div className="text-gray-500 text-2xl">
                {username !== "" ? (
                  <CustomPopup />
                ) : (
                  <span
                    className="cursor-pointer hover:opacity-85 dark:text-white"
                    onClick={() => dispatch(updateModal(true))}
                    data-test="login-btn"
                  >
                    Login
                  </span>
                )}
              </div>
            </div>
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={showCart}
              data-test="cart-btn"
            >
              <AiOutlineShoppingCart className="dark:text-white" />
              <div
                className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center"
                data-test="cart-item-count"
              >
                {cartCount}
              </div>
            </div>
            <div
              onClick={() => {
                dispatch(updateDarkMode(!isDarkMode));
                document.body.classList.toggle("dark");
              }}
            >
              {isDarkMode ? (
                <MdOutlineLightMode className="cursor-pointer" size={30} />
              ) : (
                <MdOutlineDarkMode className="cursor-pointer" size={30} />
              )}
            </div>
          </div>

          {/* Hamburger Menu */}
          <div
            className="md:hidden text-2xl cursor-pointer dark:text-white"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-4 dark:text-white">
            <Link
              to="/products"
              className="text-xl font-bold"
              data-test="main-products"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-xl font-bold"
              data-test="main-categories"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>
            <div className="flex items-center gap-2">
              {username || profileimage ? (
                <img
                  src={profileimage || undefined}
                  alt="avatar"
                  className="w-6 rounded-2xl"
                />
              ) : (
                <FaUser className="text-gray-500 text-2xl dark:text-white" />
              )}
              <div
                className="text-gray-500 text-2xl relative"
                onClick={(e) => e.stopPropagation()} // Prevent menu closure
              >
                {username !== "" ? (
                  <CustomPopup />
                ) : (
                  <span
                    className="cursor-pointer hover:opacity-85 dark:text-white"
                    onClick={() => {
                      dispatch(updateModal(true));
                      setMenuOpen(false); // Optional: Close menu after login modal is triggered
                    }}
                    data-test="login-btn"
                  >
                    Login
                  </span>
                )}
              </div>
            </div>
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={showCart}
              data-test="cart-btn"
            >
              <AiOutlineShoppingCart className="dark:text-white" />
              <div
                className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center"
                data-test="cart-item-count"
              >
                {cartCount}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
