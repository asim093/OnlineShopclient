import { FC, FormEvent, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, updateModal } from "../redux/features/authSlice";
import { FaUnlock } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import toast, { Toaster } from "react-hot-toast";
import { ImAttachment } from "react-icons/im";

const LoginModal: FC = () => {
  const [clicked, setClicked] = useState(false); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileimage, setProfileImage] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);

  // Handle profile image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Submit login request
  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://ministerial-inger-asim-3f191a31.koyeb.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      
      const data = await response.json();
      console.log(data);
      if (data.token) {
        toast.success("User Login Successfully");
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userdata", JSON.stringify([data.user]));
        // const userimage = data.user.profileimage;
        // const image = localStorage.setItem("userimage", userimage);
        dispatch(doLogin({ username: data.user.username, password , image:data.user.profileimage }));
        dispatch(updateModal(false));
      } else {
        toast.error(`Login failed: ${data.message}`);
      }
    } catch (error: any) {
      toast.error(`Error during login: ${error.message}`);
    }
  };

  // Submit registration request
  const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profileimage) {
        formData.append("profileimage", profileimage);
      }

      const response = await fetch(
        "https://ministerial-inger-asim-3f191a31.koyeb.app/auth/Signup",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Registration successful! Please log in.");
        setClicked(false); // Redirect to login form
      } else {
        toast.error(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Modal UI
  if (open) {
    return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center font-karla">
        <div className="relative border shadow rounded p-8 bg-white max-w-md w-full z-40 dark:bg-slate-800 dark:text-white">
          <RxCross1
            className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
            onClick={() => dispatch(updateModal(false))}
          />
          {clicked ? (
            <>
              {/* Register Form */}
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <GiArchiveRegister />
                <h3 className="font-bold text-center text-2xl">Register</h3>
                <GiArchiveRegister />
              </div>
              <form
                onSubmit={submitRegister}
                className="flex flex-col space-y-3"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your username here"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email here"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Your password here"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    onChange={handleImageChange}
                  />
                  <ImAttachment className="absolute top-3 left-2 text-lg" />
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setClicked(false)}
                >
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              {/* Login Form */}
              <div className="flex mb-2 space-x-2 justify-center items-center">
                <FaUnlock />
                <h3 className="font-bold text-center text-2xl">Login</h3>
                <FaUnlock />
              </div>
              <form onSubmit={submitLogin} className="flex flex-col space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email here"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <RiUser3Fill className="absolute top-3 left-2 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Your password here"
                    className="border w-full border-black py-2 px-8 rounded dark:bg-slate-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
                </div>
                <input
                  type="submit"
                  value="Login"
                  className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
                />
              </form>
              <p className="text-center mt-1">
                Don't have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setClicked(true)}
                >
                  Register
                </span>
              </p>
            </>
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  return null;
};

export default LoginModal;
