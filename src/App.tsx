import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store/store";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Manufacturers from "./pages/Manufacturers";
import BikeModels from "./pages/BikeModels";
import BikeModelDetails from "./pages/BikeModelDetails";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import ProfileSettings from "./pages/ProfileSettings";
import Addresses from "./pages/Addresses";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import Search from "./pages/Search";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import Feedback from "./pages/Feedback";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Categories />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            {/* <Route path="/manufacturers/:id" element={< />} /> */}
            <Route path="/bike-models" element={<BikeModels />} />
            <Route path="/bike-models/:id" element={<BikeModelDetails />} />
            <Route path="/products/parts/:id" element={<ProductDetail />} />
            <Route path="/products/merchandise/:id" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/profile" element={<ProfileSettings />} />
            <Route path="/account/addresses" element={<Addresses />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/orders/:id" element={<Orders />} />
            <Route path="/account/orders/:id/track" element={<OrderTracking />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/reviews" element={<Reviews />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
