import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../asset/css/addproduct.css";
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchCategories } from "../services/api";
//
const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [form, setForm] = useState({
        id: null,
        productname: "",
        categoryID: "",
        unitprice: "",
        quantity: "",
        imageUrl: "",
        description: "",
        sizes: [],
    });
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 8;
    const base_url = "https://back-end-e-commerce-p0si.onrender.com";

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            const categories = await fetchCategories();
            setCategories(categories);
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productname", form.productname);
        formData.append("categoryID", form.categoryID);
        formData.append("unitprice", form.unitprice);
        formData.append("quantity", form.quantity);
        formData.append("description", form.description);
        formData.append("sizes", JSON.stringify(form.sizes));

        if (file) {
            formData.append("image", file);
        }

        const method = editing ? "PUT" : "POST";
        const url = editing ? `${base_url}/products/${form.id}` : `${base_url}/products`;

        try {
            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                loadProducts();
                resetForm();
            } else {
                console.error("Failed to save product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({ id: null, productname: "", categoryID: "", unitprice: "", quantity: "", imageUrl: "", description: "", sizes: [] });
        setEditing(false);
        setShowForm(false);
        setFile(null);
    };


    const totalPages = Math.ceil(products.length / itemsPerPage);


    const currentProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        
        <div className="admin-container">
            <div className="admin-header">
                
                <h2 className="admin-title">Product Management</h2>
                <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
                {!showForm && <button className="add-btn" onClick={() => setShowForm(true)}>
                    <div tabindex="0" class="plusButton">
                        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                            <g mask="url(#mask0_21_345)">
                                <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                            </g>
                        </svg>
                    </div>
                </button>}
            </div>

            {showForm && (
                <form className="admin-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Product Name" value={form.productname} onChange={(e) => setForm({ ...form, productname: e.target.value })} required />
                    <select value={form.categoryID} onChange={(e) => setForm({ ...form, categoryID: e.target.value })} required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.Categoryname}</option>
                        ))}
                    </select>
                    <input type="number" placeholder="Unit Price" value={form.unitprice} onChange={(e) => setForm({ ...form, unitprice: e.target.value })} required />
                    <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></input>
                    <input
                        type="text"
                        placeholder="Sizes (e.g. M: 10, L: 20)"
                        value={Array.isArray(form.sizes)
                            ? form.sizes.map((size) => `${size.sizeName}: ${size.stock}`).join(", ")
                            : form.sizes ? JSON.parse(form.sizes).map((size) => `${size.sizeName}: ${size.stock}`).join(", ") : ""}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            try {
                                const newSizes = value.split(",").map((s) => {
                                    const [sizeName, stock] = s.split(":").map((item) => item.trim());
                                    return { sizeName, stock: stock ? parseInt(stock) : 0 };
                                });

                                const jsonString = JSON.stringify(newSizes);
                                setForm({ ...form, sizes: jsonString });
                            } catch (error) {
                                console.error("Invalid sizes format:", error);
                                setForm({ ...form, sizes: [] });
                            }
                        }}
                    />
                    <button className="add-p-btn" type="submit">{editing ? "Update Product" : "Add Product"}</button>
                    <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                </form>
            )}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Image</th>
                        <th>Description</th>
                        <th>Sizes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productname}</td>
                            <td>{categories.find((category) => category.id === product.categoryID)?.Categoryname || "Unknown"}</td>
                            <td>{product.unitprice}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <img
                                    src={product.imageurl ? `${base_url}${product.imageurl}` : "default-image.jpg"}
                                    alt={product.productname || "No Image"}
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                            </td>
                            <td>{product.description}</td>
                            <td>
                                {(() => {
                                    try {
                                        const parsedSizes = JSON.parse(product.sizes);
                                        return Array.isArray(parsedSizes)
                                            ? parsedSizes.map(size => `${size.sizeName}`).join(", ")
                                            : "N/A";
                                    } catch (error) {
                                        return "Invalid Data";
                                    }
                                })()}
                            </td>
                            <td className="action-buttons">
                                <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                                <button className="delete-btn-pd" onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span className="pagination-text"> Page {currentPage} of {totalPages} </span>
                <button
                    className="pagination-button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default AdminProduct;
