import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../asset/css/heart.css';

const Heart = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      const wishlistKey = `wishlist_${storedUser.id}`;
      const storedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      setWishlist(storedWishlist);
    } else {
      setWishlist([]);
    }
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const wishlistKey = `wishlist_${storedUser.id}`;
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);

    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
  };

  return (
    <>
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map((product) => (
            <div className="wishlist-item" key={product.id}>
              <img src={product.imageurl} alt={product.productname} className="wishlist-img"/>
              <div className="product-info">
                <h3>{product.productname}</h3>
                <p>{product.description}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty. Start adding some items!</p>
      )}
      <Link to="/product" className="btn back-to-shop">Back to Shop</Link>
    </div>
   
   </>
  );
};

export default Heart;
