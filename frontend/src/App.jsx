import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import Home from "./Pages/Home.jsx";
import { Toaster } from "sonner";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Profile from "./Pages/Profile.jsx";
import CollectionPage from "./Pages/CollectionPage.jsx";
import ProductsDetails from "./Components/Products/ProductsDetails.jsx";
import Checkout from "./Components/Cart/Checkout.jsx";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./Pages/OrderDetailsPage.jsx";
import MyOrdersPage from "./Pages/MyOrdersPage.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminHomePage from "./Pages/AdminHomePage.jsx";
import UserManagement from "./Components/Admin/UserManagement.jsx";
import ProductManagement from "./Components/Admin/ProductManagement.jsx";
import EditProductPage from "./Components/Admin/EditProductPage.jsx";
import OrderManagement from "./Components/Admin/OrderManagement.jsx";
import {Provider} from 'react-redux';
import { store } from "./redux/store.js";
import ProtectedRoutes from "./Components/Common/ProtectedRoutes.jsx";


const App = () => {
  return (
    <Provider store={store}>  
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
                  {/* UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collections/:collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductsDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>
                    {/* AdminLayout */}
        <Route path="/admin" element={<ProtectedRoutes role='admin'>
          <AdminLayout />
        </ProtectedRoutes>}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement/>}/> 
        </Route>

      </Routes>

    </BrowserRouter>
    </Provider>
  );
};

export default App;
