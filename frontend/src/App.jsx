import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Product from "./components/product";
import Register from "./components/register";
import Cart from "./components/cart";
import Heart from "./components/heart";
import Checkout from "./components/checkout"
import Getcode from "./components/getcode"
import Adminuser from "./components/adminuser";
import AdminProduct from "./components/adminproduct";
import Admincategory from "./components/admincategory";
import Adminorder from "./components/adminorder"
import OrderDetail from "./components/orderdetail";
import Discount from "./components/discount"
import Admin from "./components/admin"
import EditProfile from "./components/editprofile";
import ReportTable from "./components/report";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/getcode" element={<Getcode />} />
        <Route path="/adminuser" element={<Adminuser />} />
        <Route path="/adminproduct" element={<AdminProduct />} />
        <Route path="/admincategory" element={<Admincategory />} />
        <Route path="/adminorder" element={<Adminorder />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/report" element={<ReportTable />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;