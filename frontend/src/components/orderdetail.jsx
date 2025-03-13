import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { getOrderById, getUserById, updateOrder, deleteOrderItem, updateOrderItemQuantity, getDiscountById, addProductToOrder,fetchProducts,updateStockForProduct } from '../services/api';
import "../asset/css/orderdetail.css";
import { div } from 'framer-motion/client';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState("");
    const [discount, setDiscount] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [products, setProducts] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);
    const [quantityUpdates, setQuantityUpdates] = useState({});
    const [editingQuantities, setEditingQuantities] = useState({});
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ productId: '', quantity: 1 });

    const base_url = "https://back-end-e-commerce-p0si.onrender.com";

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrderById(orderId);
                const data = await fetchProducts();
                setOrder(response);
                setStatus(response.status);
                setShippingAddress(response.shippingaddress);
                setProducts(data);
                if (response.userid) {
                    const userResponse = await getUserById(response.userid);
                    setUsername(userResponse.username);
                    setEmail(userResponse.email);
                }
                if(response.discount){
                    const discountResponse = await getDiscountById(response.discount);
                    setDiscount(discountResponse);
                }
                const initialQuantities = {};
                response.orderdetails.forEach(item => {
                    initialQuantities[item.productid] = item.quantity;
                });
                setQuantityUpdates(initialQuantities);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [orderId]);
    

    const handleUpdateOrder = async (e) => {
        e.preventDefault();
    
        const stockUpdates = order.orderdetails.map(item => ({
            productId: item.productid,
            quantity: item.quantity,
            size: item.size
        }));
    
        try {
            const updatedOrder = await updateOrder(orderId, { status, shippingaddress: shippingAddress });
    
            if (status === 'Shipped') {
                for (const { productId, quantity, size } of stockUpdates) {
                    await updateProductStock(productId, { quantity: -quantity }, size);
                }
            }
    
            setOrder(updatedOrder);
            setEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };
    
    const updateProductStock = async (productId, stockData, size) => {
        try {
            await updateStockForProduct(productId, stockData, size);
        } catch (error) {
            console.error('Error updating product stock:', error);
        }
    };
    
    const handleDeleteItem = async (productId) => {
        try {
            await deleteOrderItem(orderId, productId);
            setOrder((prevOrder) => ({
                ...prevOrder,
                orderdetails: prevOrder.orderdetails.filter(item => item.productid !== productId)
            }));
        } catch (error) {
            console.error('Error deleting item:', error.response?.data || error.message);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantityUpdates(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
    };

    const handleUpdateQuantity = async (productId) => {
        const newQuantity = quantityUpdates[productId];

        try {
            await updateOrderItemQuantity(orderId, productId, { quantity: newQuantity });
            setOrder((prevOrder) => ({
                ...prevOrder,
                orderdetails: prevOrder.orderdetails.map(item =>
                    item.productid === productId ? { ...item, quantity: newQuantity } : item
                )
            }));
            setEditingQuantities(prev => ({ ...prev, [productId]: false }));
        } catch (error) {
            console.error('Error updating quantity:', error.response?.data || error.message);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.productId || newProduct.quantity <= 0 || !newProduct.size) {
            alert("Please select a product and quantity.");
            return;
        }
        try {
            const productData = { productid: newProduct.productId, quantity: newProduct.quantity ,size: newProduct.size};
            console.log("Adding product data:", productData);
            const updatedOrder = await addProductToOrder(orderId, productData);
            setOrder(updatedOrder);
            setNewProduct({ productId: '', quantity: 1 ,size:''});
            window.location.reload();
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message);
        }
    };
    

    return (
        <>
            <div>
                <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div className="order-info-container">
                <h2>Order ID: {order?.id}</h2>
                <div>
                    <p className="order-status">Customer Name: {username || "Unknown"}</p>
                    <p className="order-status">Customer Email: {email || "Unknown"}</p>
                    <p className="order-status">
                        Discount: {discount.discount_name || "Not used"}
                        <span>Percentage: {discount.percentage || "Not used"}</span>
                    </p>
                </div>
                {editing ? (
                    <form className="edit-form" onSubmit={handleUpdateOrder}>
                        <label>
                            Status:
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </label>
                        <label>
                            Shipping Address:
                            <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                        </label>
                        <button className="order-btn-save" type="submit">Save</button>
                        <button className="order-btn-cancel" type="button" onClick={() => setEditing(false)}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <p className="order-status">Status: {order?.status}</p>
                        <p className="order-status">Shipping: {order?.shippingaddress}</p>
                        <p className="order-status">Total: ${order?.total}</p>
                        <button className="order-btn-edit" onClick={() => setEditing(true)}>Edit</button>
                    </>
                )}
    
                <button className="order-btn-proof" onClick={() => setShowPopup(true)}>Show Payment Proof</button>
    
                {showPopup && (
                    <div className={`popup-overlay ${showPopup ? 'show' : ''}`} onClick={() => setShowPopup(false)}>
                        <div className={`popup-content ${showPopup ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <span className="close-btn" onClick={() => setShowPopup(false)}>✖</span>
                            <img src={`${base_url}${order?.paymentproof}`} alt="Payment Proof" className="popup-image" />
                        </div>
                    </div>
                )}
    
                <h3 className="order-items-header">Items:</h3>
                <button className='order-btn-toggle-delete' onClick={() => setDeleteMode(prev => !prev)}>
                    {deleteMode ? 'Disable Delete Mode' : 'Enable Delete Mode'}
                </button>
    
                {order?.orderdetails && order.orderdetails.length > 0 ? (
                    <ul className="order-list">
                        {order.orderdetails.map((item) => (
                            <li key={item.id} className="order-list-item">
                                <div className="item-details">
                                    <p><span className="item-label">Product Name:</span> {item.product.productname}</p>
                                    <p><span className="item-label">Size:</span> {item.size}</p>
                                    <p><span className="item-label">Unit Price:</span> ${item.unitprice}</p>
                                    {editingQuantities[item.productid] ? (
                                        <>
                                            <label>
                                                <span className="item-label">Quantity:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantityUpdates[item.productid]}
                                                    onChange={(e) => handleQuantityChange(item.productid, e.target.value)}
                                                />
                                            </label>
                                            <button className="save-quantity-btn" onClick={() => handleUpdateQuantity(item.productid)}>Save</button>
                                            <button className="cancel-quantity-btn" onClick={() => setEditingQuantities(prev => ({ ...prev, [item.productid]: false }))}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <p><span className="item-label">Quantity:</span> {item.quantity}</p>
                                            <button className="edit-quantity-btn" onClick={() => setEditingQuantities(prev => ({ ...prev, [item.productid]: true }))}>Edit Quantity</button>
                                        </>
                                    )}
                                </div>
                                <div className="item-image-container">
                                    <img className="item-image" src={`${base_url}${item.product.imageurl}`} alt={item.product.productname} />
                                </div>
                                {deleteMode && (
                                    <button className="delete-btn" onClick={() => handleDeleteItem(item.productid)}>Delete</button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items found.</p>
                )}
    
                <button className="order-btn-add" onClick={() => setShowAddProductForm(!showAddProductForm)}>
                    {showAddProductForm ? 'Cancel' : 'Add Product'}
                </button>
    
                {showAddProductForm && (
                    <form className="add-product-form" onSubmit={handleAddProduct}>
                        <label>
                            Select Product:
                            <select
                                value={newProduct.productId}
                                onChange={(e) => {
                                    const selectedProductId = e.target.value;
                                    setNewProduct({ ...newProduct, productId: selectedProductId, size: "" });
                                }}
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.productname}</option>
                                ))}
                            </select>
                        </label>
    
                        <label>
                            Quantity:
                            <input
                                type="number"
                                min="1"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                            />
                        </label>
    
                        <label>
                            Size:
                            <input
                                type="text"
                                value={newProduct.size}
                                onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                                placeholder="Enter size"
                            />
                        </label>
                        <button className="order-btn-submit" type="submit">Add Product</button>
                    </form>
                )}
    
            </div>
        </>
    );
    
};
export default OrderDetail;

