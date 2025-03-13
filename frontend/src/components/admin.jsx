import React, { useEffect } from 'react';
import '../asset/css/Admin.css';

const Admin = () => {
  useEffect(() => {
    var cursor = document.querySelector('.blob');

    if (cursor) {
      document.addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
      });

      return () => {
        document.removeEventListener('mousemove', function (e) {
          var x = e.clientX;
          var y = e.clientY;
          cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
        });
      };
    }
  }, []); 
  return (
    <>
    <div className='admin-background'>
      <nav className="navMenu">
        <a href="/">Home</a>
        <a href="/adminproduct">Product</a>
        <a href="/adminuser">Users</a>
        <a href="/adminorder">Orders</a>
        <a href="/Discount">Discount</a>
        <a href="/report">Report</a>
        <a href="/admincategory">Category</a>
      </nav>
      <div className="blob"></div>
      </div>
    </>
  );
};

export default Admin;
