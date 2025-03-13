import React, { useEffect, useState } from "react";
import "../asset/css/OrderReport.css";
import { reports } from "../services/api";
import { useNavigate } from 'react-router-dom';
const ReportTable = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await reports();
                const groupedOrders = data.reduce((acc, order) => {
                    if (!acc[order.id]) {
                        acc[order.id] = { ...order, products: [] };
                    }
                    acc[order.id].products.push({ ...order.product, quantity: order.quantity });
                    return acc;
                }, {});

                setOrders(Object.values(groupedOrders));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    return (
        
        <div className="order-report-container">
            <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
            <h2 className="report-title">📊 Order Report</h2>
            <div className="table-container">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Discount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td>{order.user.username}</td>
                                    <td>{order.user.email}</td>
                                    <td className="order-id">{order.id}</td>
                                    <td className={`status ${order.status === "pending" ? "pending" : "completed"}`}>
                                        {order.status}
                                    </td>
                                    <td>{order.products.length} items</td>
                                    <td className="center">
                                        {order.products.reduce((sum, product) => sum + product.quantity, 0)}
                                    </td>
                                    <td className="price">฿{order.total}</td>
                                    <td className="discount">{order.discount_percentage}%</td>
                                    <td>
                                        <button className="more-btn"onClick={() => toggleExpand(order.id)}>
                                            {expandedOrders[order.id] ? "Hide" : "More"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrders[order.id] && (
                                    <tr>
                                        <td colSpan="9">
                                            <ul>
                                                {order.products.map((product, index) => (
                                                    <li key={index}>
                                                        {product.productname} - {product.Category?.Categoryname || "No Category"} - ฿{product.unitprice} - amount: {product.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;
