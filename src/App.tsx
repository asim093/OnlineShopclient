import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import SingleProduct from "./pages/SingleProduct";
import LoginModal from "./components/LoginModal";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AllProducts from "./pages/AllProducts";
import ScrollToTopButton from "./components/ScrollToTopButton";
import BannerPopup from "./components/BannerPopup";
import AllCategories from "./pages/AllCategories";
import SingleCategory from "./pages/SingleCategory";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
// import Success from "./pages";
// import AdminPanel from "./pages/AdminPanel";

function App() {
  const location = useLocation(); // Get the current location to check the route

  return (
    <Provider store={store}>
      <div>
        {location.pathname !== "/Admin" && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Admin" element={<AdminPanel />} />  */}
          <Route path="/products" element={<AllProducts />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/product/:productID" element={<SingleProduct />} />
          <Route path="/category/:slug" element={<SingleCategory />} />

          <Route path="/wishlist" element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
          <Route path="/Success" element={<ProtectedRoute />}>
            <Route path="/Success" element={<Success/>} />
          </Route>
          <Route path="/Cancel" element={<ProtectedRoute />}>
            <Route path="/Cancel" element={<Cancel/>} />
          </Route>
          <Route path="/account" element={<ProtectedRoute />}>
            <Route path="/account" element={<Profile />} />
          </Route>
        </Routes>

        {/* Toast notifications */}
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* Footer and other components */}
        <Footer />
        <Cart />
        <LoginModal />
        <ScrollToTopButton />
        <BannerPopup />
      </div>
    </Provider>
  );
}

export default App;
