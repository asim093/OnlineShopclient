import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { addToCart, setCartState } from "../redux/features/cartSlice";
import { Product } from "../models/Product";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import ProductList from "../components/ProductList";
import Reviews from "../components/Reviews";
import useAuth from "../hooks/useAuth";
import { MdFavoriteBorder } from "react-icons/md";
import { addToWishlist } from "../redux/features/productSlice";

const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const { productID } = useParams();
  const [product, setProduct] = useState<Product>();
  const [imgs, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [sCategory, setScategory] = useState<string>("");
  const [similar, setSimilar] = useState<Product[]>([]);
  const [review, Setreview] = useState<any>([]);
  const [text, Setreviewtext] = useState<string>("");
  const { requireAuth } = useAuth();

  useEffect(() => {
    const fetchProductDetails = () => {
      fetch(
        `https://ministerial-inger-asim-3f191a31.koyeb.app/product/getsingleproduct/${productID}`
      )
        .then((res) => res.json())
        .then((data) => {
          const { image } = data.product;
          console.log(data);
          

          Setreview(data.product.reviews);

          setProduct(data.product);
          const images = Array.isArray(image) ? image : [image];
          setImgs(images);
          setSelectedImg(images[0]);
        });
    };

    fetchProductDetails();
  }, [productID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    Setreviewtext(e.target.value);
  };
  
  const Addreview = async () => {
    if (text === "") {
      toast.error("Please enter a review", {
        duration: 3000,
      });
      return;
    }

    const userdata = localStorage.getItem("userdata");
    const token = localStorage.getItem("authToken");

    if (!userdata) {
      toast.error("User not logged in!", {
        duration: 3000,
      });
      return;
    }

    try {
      const parsedData = JSON.parse(userdata);
      const userid = parsedData[0]._id; // Ensure the structure matches your data
      const productid = productID;

      const response = await fetch(
        `https://ministerial-inger-asim-3f191a31.koyeb.app/review/AddReview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productid, userid, text }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Review added successfully", {
          duration: 3000,
        });
        Setreview([...review, result.newReview]); // Assuming `newReview` is returned
        Setreviewtext(""); // Clear input
      } else {
        toast.error(result.message || "Failed to add review", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("An error occurred while adding the review", {
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchPreferences = (cat: string) => {
      fetch(`https://dummyjson.com/products/category/${cat}`)
        .then((res) => res.json())
        .then((data) => {
          const _products: Product[] = data.products;
          const filtered = _products.filter((product) => {
            if (productID && product._id !== parseInt(productID))
              return product;
          });
          setSimilar(filtered);
        });
    };
    if (sCategory && sCategory !== "") fetchPreferences(sCategory);
  }, [productID, sCategory]);

  const addCart = () => {
    requireAuth(() => {
      if (product)
        dispatch(
          addToCart({
            _id: product._id,
            price: product.price,
            name: product.name,
            image: product.image,
            discountPercentage: product.discountPercentage,
          })
        );
      toast.success("item added to cart successfully", {
        duration: 3000,
      });
    });
  };

  const buyNow = () => {
    requireAuth(() => {
      if (product)
        dispatch(
          addToCart({
            _id: product._id,
            price: product.price,
            name: product.name,
            image: product.image,
            discountPercentage: product.discountPercentage,
          })
        );
      dispatch(setCartState(true));
    });
  };

  const addWishlist = () => {
    requireAuth(() => {
      if (product) {
        dispatch(addToWishlist(product));
        toast.success("item added to your wishlist", {
          duration: 3000,
        });
      }
    });
  };

  return (
    <div className="font-sans bg-white border ">
      <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto ">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(169,170,172,0.8)] p-6 rounded">
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            <div className="px-4 py-10 rounded shadow-md relative">
              <img
                src={selectedImg}
                alt="Product"
                className="w-4/5 aspect-[251/171] rounded object-cover mx-auto"
              />
              <button type="button" className="absolute top-4 right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  fill="#ccc"
                  className="mr-1 hover:fill-[#333]"
                  viewBox="0 0 64 64"
                >
                  <path
                    d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800">{product?.name}</h3>
            <div className="flex items-center space-x-1 mt-2">
              <svg
                className="w-4 h-4 fill-blue-600"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              <svg
                className="w-4 h-4 fill-blue-600"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              <svg
                className="w-4 h-4 fill-blue-600"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              <svg
                className="w-4 h-4 fill-blue-600"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              <svg
                className="w-4 h-4 fill-[#CED5D8]"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              <h4 className="text-gray-500 text-base !ml-3">
                {review.length} Reviews
              </h4>
            </div>

            <p className="text-sm text-gray-500 mt-2">{product?.description}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <p className="text-gray-800 text-2xl font-bold">
                Rs : {product?.price}
              </p>
              <p className="text-gray-500 text-base">
                {/* <strike>$1500</strike>{" "} */}
                <span className="text-sm ml-1">Tax included</span>
              </p>
            </div>

            <div className="flex gap-4 mt-12 max-w-md">
              <button
                type="button"
                className="w-full px-4 py-2.5 outline-none border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded"
                onClick={addWishlist}
              >
                WishList
              </button>
              <button
                type="button"
                className="w-full px-4 py-2.5 outline-none border border-blue-600 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded"
                onClick={addCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 shadow-[0_2px_10px_-3px_rgba(169,170,172,0.8)] p-6">
          <h3 className="text-xl font-bold text-gray-800">
            Reviews {review.length}
          </h3>
          <div className="grid md:grid-cols-2 gap-12 mt-4">
            <div className="space-y-3 max-w-md">
              <div className="flex items-center">
                <p className="text-sm text-gray-800 font-bold">5.0</p>
                <svg
                  className="w-5 fill-blue-600 ml-1"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <div className="bg-gray-400 rounded w-full h-2 ml-3">
                  <div className="w-2/3 h-full rounded bg-blue-600"></div>
                </div>
                <p className="text-sm text-gray-800 font-bold ml-3">66%</p>
              </div>

              <div className="flex items-center">
                <p className="text-sm text-gray-800 font-bold">4.0</p>
                <svg
                  className="w-5 fill-blue-600 ml-1"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <div className="bg-gray-400 rounded w-full h-2 ml-3">
                  <div className="w-1/3 h-full rounded bg-blue-600"></div>
                </div>
                <p className="text-sm text-gray-800 font-bold ml-3">33%</p>
              </div>

              <div className="flex items-center">
                <p className="text-sm text-gray-800 font-bold">3.0</p>
                <svg
                  className="w-5 fill-blue-600 ml-1"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <div className="bg-gray-400 rounded w-full h-2 ml-3">
                  <div className="w-1/6 h-full rounded bg-blue-600"></div>
                </div>
                <p className="text-sm text-gray-800 font-bold ml-3">16%</p>
              </div>

              <div className="flex items-center">
                <p className="text-sm text-gray-800 font-bold">2.0</p>
                <svg
                  className="w-5 fill-blue-600 ml-1"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <div className="bg-gray-400 rounded w-full h-2 ml-3">
                  <div className="w-1/12 h-full rounded bg-blue-600"></div>
                </div>
                <p className="text-sm text-gray-800 font-bold ml-3">8%</p>
              </div>

              <div className="flex items-center">
                <p className="text-sm text-gray-800 font-bold">1.0</p>
                <svg
                  className="w-5 fill-blue-600 ml-1"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <div className="bg-gray-400 rounded w-full h-2 ml-3">
                  <div className="w-[6%] h-full rounded bg-blue-600"></div>
                </div>
                <p className="text-sm text-gray-800 font-bold ml-3">6%</p>
              </div>
            </div>
            {review.map((item: any, index: number) => (
              <div key={index}>
                <div className="flex items-start">
                  <img
                    src="https://readymadeui.com/team-2.webp"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="ml-3">
                    <h4 className="text-sm font-bold text-gray-800">
                      John Doe
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <p className="text-xs !ml-2 font-semibold text-gray-800">
                        2 mins ago
                      </p>
                    </div>
                    <p className="text-sm mt-3 text-gray-500">{review[index].text}</p>
                  </div>
                </div>

                <div>
                  <p className="text-blue-600 text-sm mt-6 cursor-pointer font-semibold">
                    Read all reviews
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full	 border  my-5 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700"
            >
              Write a Review
            </label>
            <textarea
            onChange={handleChange}
              id="review"
              name="review"
              rows={4}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your review here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={Addreview}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
