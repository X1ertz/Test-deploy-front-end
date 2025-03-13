import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { getUserById, saveUser, changePassword, getUserOrders} from "../services/api";
import "../asset/css/editprofile.css"
const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [user, setUser] = useState(storedUser || { username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newAddress, setNewAddress] = useState(""); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 

  const [confirmPassword, setConfirmPassword] = useState("");
  const [orderDetailsPopup, setOrderDetailsPopup] = useState(null);
  const [addresses, setAddresses] = useState(() => {
    return JSON.parse(localStorage.getItem(`user_${userId}_addresses`)) || [];
  });
  const [orders, setOrders] = useState([]); 

  useEffect(() => {
    if (!userId) return;

    getUserById(userId)
      .then((data) => {
        setUser(data);
      })
      .catch(() => toastr.error("Failed to load data"));

    const savedAddresses = JSON.parse(localStorage.getItem(`user_${userId}_addresses`)) || [];
    setAddresses(savedAddresses);

    getUserOrders(userId)
      .then((data) => {
        setOrders(data);
      })
      .catch(() => toastr.error("You not have an orders"));
  }, [userId]);
  const handleViewDetails = (orderDetails) => {
    setOrderDetailsPopup(orderDetails);
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleClosePopup = () => {
    setOrderDetailsPopup(null);
};


  const handleSaveProfile = async () => {
    const userId = user.id || storedUser?.id;
    if (!userId) {
      return;
    }

    const isEditing = true;
    try {
      await saveUser({ id: userId, username: user.username, email: user.email }, isEditing);
            toastr.success("Profile saved successfully!");
            setIsEditing(false);
        } catch (error) {
        }
    };
  
    const handleAddAddress = () => {
        if (!newAddress.trim()) {
            toastr.error("Please enter an address");
            return;
        }
        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);
        localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
        setNewAddress("");
        toastr.success("Address added successfully!");
    };

    const handleDeleteAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
        localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
        toastr.warning("Address deleted successfully!");
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toastr.error("Please complete all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toastr.error("New passwords do not match");
            return;
        }

        try {
            await changePassword(userId, oldPassword, newPassword);
            toastr.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);
        } catch (error) {
            toastr.error("Failed to change password");
        }
    };

    return (
        
        <div className="profile-layout">
            <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
            <h2 className="profile-title">Your Profile</h2>

            <div className="profile-sections">
                <div className="profile-info">
                    {!isEditing ? (
                        <>
                            <p className="profile-info-text">Username: {user.username}</p>
                            <p className="profile-info-text">Email: {user.email}</p>
                            <p className="profile-info-text">Address: {user.adress}</p>
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    ) : (
                        <div className="profile-form-container">
                            <label className="form-label">Username:</label>
                            <input type="text" name="username" value={user.username} onChange={handleInputChange} className="form-input" />

                            <label className="form-label">Email:</label>
                            <input type="email" name="email" value={user.email} onChange={handleInputChange} className="form-input" />

                            <div className="action-buttons">
                                <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="address-section">
                    <h3 className="section-titlee">Your Addresses</h3>
                    <ul className="address-list">
                        {addresses.map((address, index) => (
                            <li key={index} className="address-item">
                                {address} <button className="delete-btn" onClick={() => handleDeleteAddress(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <div className="address-add-container">
                        <input
                            type="text"
                            className="add-address-input"
                            placeholder="Add new address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                        <button className="add-address-btn" onClick={handleAddAddress}>Add Address</button>
                    </div>
                </div>

                <div className="password-section">
                    <h3 className="section-titlee">Change Password</h3>
                    {!isChangingPassword ? (
                        <button className="change-password-btn" onClick={() => setIsChangingPassword(true)}>Change Password</button>
                    ) : (
                        <div className="change-password-form">
                            <label className="form-label">Old Password:</label>
                            <input type="password" className="form-input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

                            <label className="form-label">New Password:</label>
                            <input type="password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                            <label className="form-label">Confirm New Password:</label>
                            <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <div className="action-buttons">
                                <button className="save-btn" onClick={handleChangePassword}>Save</button>
                                <button className="cancel-btn" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="orders-section">
                    <h3 className="section-titlee">Collection Orders</h3>
                    <div className="orders-container">
                        {orders.length === 0 ? (
                            <p className="no-orders-message">You have no orders yet.</p>
                        ) : (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th></th>
                                        <th>Size</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <React.Fragment key={index}>
                                            {order.orderdetails.map((detail, idx) => (
                                                <tr key={`${index}-${idx}`} className="order-item">
                                                    {idx === 0 && (
                                                        <>
                                                            <td rowSpan={order.orderdetails.length}>{detail.product.productname}</td>
                                                        </>
                                                    )}
                                                    {idx === 0 && (
                                                        <>
                                                            <td></td>
                                                            <td>{detail.size}</td>
                                                            <td rowSpan={order.orderdetails.length} className="order-status">{order.status}</td>
                                                            <td rowSpan={order.orderdetails.length} className="order-actions">
                                                                <button className="view-details-btn" onClick={() => handleViewDetails(order.orderdetails)}>View Details</button>

                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>

                            </table>
                        )}
                    </div>
                </div>
            </div>

            {orderDetailsPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Order Details</h3>
                        <ul>
                            {orderDetailsPopup.map((detail, index) => (
                                <li key={index}>
                                    <td>Product: {detail.product.productname}</td>
                                    <td>Size: {detail.size}</td>
                                    <td>Status: {detail.status}</td>
                                    <td>Price: ${detail.unitprice}</td>
                                </li>
                            ))}
                        </ul>
                        <button className="close-popup-btn" onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;

