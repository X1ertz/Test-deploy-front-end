import React from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../asset/css/checkout.css';
import { faCreditCard,faUser, faGear,faPen,faHeart, faShoppingCart,faDoorOpen,faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; 
import { useEffect } from "react";
import axios from 'axios';
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProducts, total, usedDiscount } = location.state || { selectedProducts: [], total: 0, usedDiscount: null };
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState(() => JSON.parse(localStorage.getItem(`user_${userId}_addresses`)) || []);
  const [appliedDiscount, setAppliedDiscount] = useState(usedDiscount?.discount_amount || 0);
  const [paymentProof, setPaymentProof] = useState(null); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No user ID found in localStorage");
      return;
    }
    const storedAddresses = JSON.parse(localStorage.getItem(`user_${userId}_addresses`)) || [];
    setAddresses(storedAddresses);
  }, [userId]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.reload();
  };
  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleCheckout = async () => {
    if (!storedUser) {
      toastr.error("กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน");
      return;
    }
    if (!selectedAddress) {
      toastr.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
      return;
    }
    if (!selectedOption) {
      toastr.error("กรุณาเลือกวิธีชำระเงิน");
      return;
    }
    if (!paymentProof) {
      toastr.error("กรุณาอัปโหลดหลักฐานการชำระเงิน");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("items", JSON.stringify(selectedProducts.map((item) => ({
      productId: item.id,
      productName: item.productname,
      quantity: item.quantity,
      unitPrice: item.unitprice,
      sizes: item.size,
      totalPrice: item.unitprice * item.quantity,
    }))));

    formData.append("totalAmount", total - appliedDiscount);
    formData.append("discountUsed", usedDiscount ? JSON.stringify(usedDiscount) : "");
    formData.append("shippingAddress", selectedAddress);
    formData.append("orderDate", new Date().toISOString());
    formData.append("paymentProof", paymentProof); 

    console.log("📌 Order Data being sent:", JSON.stringify(Object.fromEntries(formData.entries()), null, 2));

    try {
      await axios.post("https://back-end-e-commerce-p0si.onrender.com/order", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toastr.success("สั่งซื้อสำเร็จ!");

      let claimedCodes = JSON.parse(localStorage.getItem(`user_${userId}_claimedCodes`)) || [];
      if (usedDiscount) {
        claimedCodes = claimedCodes.filter(code => code.id !== usedDiscount.id);
        localStorage.setItem(`user_${userId}_claimedCodes`, JSON.stringify(claimedCodes));
      }

      localStorage.removeItem(`${userId}_cart`);
      navigate("/");
    } catch (error) {
      console.error("❌ Error during checkout:", error);
      toastr.error("เกิดข้อผิดพลาด: ไม่สามารถสั่งซื้อได้");
    }
  };

  const handleAddAddress = () => {
    if (!address.trim()) {
      toastr.error("กรุณากรอกที่อยู่ก่อน");
      return;
    }
    const updatedAddresses = [...addresses, address];
    setAddresses(updatedAddresses);
    localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
    setAddress("");
    setIsEditing(false);
    toastr.success("เพิ่มที่อยู่เรียบร้อย!");
  };

  return (
    <>
    <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/cart" >Back</Link></li>
          <li><Link to="/" >Home</Link></li>
          <li><Link to="/product" >Shop</Link></li>
          {user ? (
            <>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/heart">Wishlist</Link></li>
              <li className="user-menu">
                <span onClick={toggleDropdown} className="dropdown-toggle">
                  {user.username} <FontAwesomeIcon icon={faUser} />
                </span>
                {isOpen && (
                  <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                    {user.role == "admin" && (
                      <li><Link to="/admin">Admin Panel<FontAwesomeIcon className='icon' icon={faUserShield} /></Link></li>
                    )}
                    <li><Link to="/editprofile">Edit<FontAwesomeIcon className='icon' icon={faPen} /></Link></li>
                    <li><Link to="/cart">Cart<FontAwesomeIcon className='icon' icon={faShoppingCart} /></Link></li>
                    <li><Link to="/heart">Wishlist<FontAwesomeIcon className='icon' icon={faHeart} /></Link></li>
                    <li>
                      <span onClick={handleLogout}>
                        Logout <FontAwesomeIcon className="icon" icon={faDoorOpen} />
                      </span>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <li><Link to="/login">Sign in</Link></li> 
          )}

        </ul>
      </nav>
    <div className="checkout-page-container">
      
      <h2>Checkout</h2>
      <ul className="checkout-page-items">
        {selectedProducts.map((product, index) => (
          <li key={index} className="checkout-page-item">
            <img src={`https://back-end-e-commerce-p0si.onrender.com${product.imageurl}`} alt={product.productname} />
            <div className="checkout-page-item-details">
              <p>{product.productname}</p>
              <p>{product.size}</p>
              <p>{product.quantity} x ${product.unitprice.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="checkout-page-total">Total: ${total.toFixed(2)}</h3>

      <div className="checkout-page-address">
        <h4>Shipping Address:</h4>
        {isEditing ? (
          <div className="address-form">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
            <button className="address-btn"onClick={handleAddAddress}>Add Address</button>
            <button className="address-cancle-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <select className="checkout-address-select" value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
              <option value="">Select an address</option>
              {addresses.map((addr, index) => (
                <option key={index} value={addr}>{addr}</option>
              ))}
            </select>
            <button className="checkout-add-address-btn" onClick={() => setIsEditing(true)}>+ เพิ่มที่อยู่</button>
          </>
        )}
      </div>
      <div className="checkout-payment-method">
        <h3>Payment Method</h3>
        <label className="payment-option">
          <input type="radio" name="paymentOption" value="Krungsri" checked={selectedOption === "Krungsri"} onChange={(e) => setSelectedOption(e.target.value)} />
          Krungsri
        </label>
        <label className="payment-option">
          <input type="radio" name="paymentOption" value="Kasikorn" checked={selectedOption === "Kasikorn"} onChange={(e) => setSelectedOption(e.target.value)} />
          Kasikorn
        </label>
      </div>

      <div className="checkout-qr-display">
        {selectedOption && (
          <img className="checkout-payment-image" src={require("../asset/images/qr.png")} alt={selectedOption} />
        )}
      </div>

      <div className="checkout-upload-proof">
        <h3>Upload Payment Proof</h3>
        <input type="file" accept="image/*" className="checkout-upload-input" onChange={handleFileChange} />
      </div>
      <button className="checkout-confirm-btn" onClick={handleCheckout}>Confirm Payment</button>
    </div>
    </>
  );
};

export default Checkout;
