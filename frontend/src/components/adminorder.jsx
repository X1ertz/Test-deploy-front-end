import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { getOrders, fetchUsers, fetchProducts, createOrder, fetchDiscountCodes, deleteOrder } from '../services/api';
import "../asset/css/order.css";

const Adminorder = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('Pending');
    const [shippingAddress, setShippingAddress] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [message, setMessage] = useState('');
    const [discountId, setDiscountId] = useState(null);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.userid.toString().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        fetchOrders();
        fetchProductList();
        fetchDiscountCodesList();
    }, []);
    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            const user = await fetchUsers();
            setOrders(data);
            setUsers(user);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProductList = async () => {
        try {
            const productsData = await fetchProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchDiscountCodesList = async () => {
        try {
            const discountData = await fetchDiscountCodes();
            setDiscounts(discountData);
        } catch (error) {
            console.error('Error fetching discount codes:', error);
        }
    };

    const handleAddProductField = () => {
        setSelectedProducts([...selectedProducts, '']);
        setQuantities([...quantities, 1]);
    };


    const handleProductChange = (index, value) => {
        const updatedProducts = [...selectedProducts];

        if (updatedProducts.includes(value)) {
            setMessage('ไม่สามารถเลือกสินค้าซ้ำได้');
            return;
        }

        updatedProducts[index] = value;
        setSelectedProducts(updatedProducts);

    };


    const handleQuantityChange = (index, value) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] = value;
        setQuantities(updatedQuantities);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Image selected:", file);
            setImage(file);
        }
    };
    const handleDeleteOrder = async (orderId) => {
        try {

            await deleteOrder(orderId);

            setOrders(orders.filter(order => order.id !== orderId));
            alert('คำสั่งซื้อลบเรียบร้อยแล้ว');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('เกิดข้อผิดพลาดในการลบคำสั่งซื้อ');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newOrder = {
                username,
                status,
                shippingAddress,
                products: selectedProducts.map((productId, index) => ({
                    productId,
                    quantity: quantities[index],
                })),
                discountCode: discountId,
                image,
            };


            const formData = new FormData();
            formData.append("username", newOrder.username);
            formData.append("status", newOrder.status);
            formData.append("shippingAddress", newOrder.shippingAddress);
            formData.append("discountCode", newOrder.discountCode);


            newOrder.products.forEach((item) => {
                formData.append("selectedProducts[]", item.productId);
                formData.append("quantities[]", item.quantity);
            });


            if (newOrder.image && newOrder.image instanceof File) {
                formData.append("image", newOrder.image);
            }


            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }


            await createOrder(formData);


            setMessage('คำสั่งซื้อถูกเพิ่มเรียบร้อยแล้ว');
            setShowForm(false);
            fetchOrders();

        } catch (error) {
            setMessage('เกิดข้อผิดพลาดในการเพิ่มคำสั่งซื้อ');
            console.error('Error adding order:', error);
        }
    };




    return (
        <div className="admin-order-dashboard-container">
            <h2 className="admin-order-dashboard-title">Order Dashboard</h2>
            <button className="admin-add-order-btn" onClick={() => setShowForm(true)}>
                Add New Order
            </button>
            <div className="group">
                <input
                    type="text"
                    placeholder="🔍 Search bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
            {showForm && (
                
                <div className="admin-popup-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="admin-close-btn" onClick={() => setShowForm(false)}>✖</span>
                        <h3 className="admin-popup-header">Create New Order</h3>
                        <form onSubmit={handleSubmit} className="admin-order-form">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Username:</label>
                                <select
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="admin-select"
                                >
                                    <option value="">Select Username</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Status:</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-select">
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Shipping Address:</label>
                                <input
                                    type="text"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    required
                                    className="admin-input"
                                />
                            </div>


                            <div className="admin-form-group">
                                <label className="admin-form-label">Upload Image:</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="admin-input-file"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Product(s):</label>
                                {selectedProducts.map((product, index) => (
                                    <div key={index} className="admin-product-input">

                                        <select
                                            value={product}
                                            onChange={(e) => handleProductChange(index, e.target.value)}
                                            required
                                            className="admin-select product-select"
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((productItem) => (
                                                <option key={productItem.id} value={productItem.id}>
                                                    {productItem.productname}
                                                </option>
                                            ))}
                                        </select>


                                        <input
                                            type="number"
                                            value={quantities[index]}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            required
                                            min="1"
                                            className="admin-input-quantity"
                                            placeholder="Quantity"
                                        />

                                    </div>
                                ))}

                                <button type="button" onClick={handleAddProductField} className="admin-add-product-btn">
                                    + Add Product
                                </button>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Discount Code:</label>
                                <select
                                    value={discountId}
                                    onChange={(e) => setDiscountId(e.target.value)}
                                    className="admin-select"
                                >
                                    <option value="">Select Discount Code</option>
                                    {discounts.map((discount) => (
                                        <option key={discount.id} value={discount.id}>
                                            {discount.discount_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="admin-submit-btn">Create Order</button>
                        </form>
                        {message && <p className="admin-message">{message}</p>}
                    </div>
                </div>
            )}

            <table className="admin-order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order.id} className={index % 2 === 0 ? 'admin-even-row' : 'admin-odd-row'}>
                            <td>{order.id}</td>
                            <td>{order.userid}</td>
                            <td
                                className="admin-status"
                                style={{
                                    backgroundColor: order.status === "Pending" ? "#ffcc00"
                                        : order.status === "Processing" ? "#17a2b8"
                                            : order.status === "Shipped" ? "#6f42c1"
                                                : order.status === "Delivered" ? "#28a745"
                                                    : order.status === "Cancelled" ? "#dc3545"
                                                        : "#ccc",
                                    color: "white",
                                    padding: "10px 10px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    display: "inline-block",
                                    minWidth: "100px",
                                    marginLeft: "35%",
                                    marginTop: "3%"
                                }}
                            >
                                {order.status}
                            </td>
                            <td>
                                <Link to={`/orders/${order.id}`} className="admin-view-btn">
                                    View Details
                                </Link>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="admin-delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Adminorder;
