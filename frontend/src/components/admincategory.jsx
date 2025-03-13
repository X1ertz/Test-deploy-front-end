import React, { useState, useEffect } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../services/api";
import "../asset/css/admincategory.css";
import { useNavigate } from 'react-router-dom';
const Admincategory = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ id: null, Categoryname: "" });
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.Categoryname.trim()) return alert("Category name is required!");

        try {
            if (editing) {
                await updateCategory(form.id, { Categoryname: form.Categoryname });
            } else {
                await addCategory({ Categoryname: form.Categoryname });
            }
            resetForm();
            loadCategories();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                loadCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleEdit = (category) => {
        setForm(category);
        setEditing(true);
    };


    const resetForm = () => {
        setForm({ id: null, Categoryname: "" });
        setEditing(false);
    };

    return (
        
        <div className="category-container">
            <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
            <h2>Category Management</h2>

  
            <form className="category-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={form.Categoryname}
                    onChange={(e) => setForm({ ...form, Categoryname: e.target.value })}
                    required
                />
                <button className="add-c-btn"type="submit">{editing ? "Update Category" : "Add Category"}</button>
                {editing && <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>}
            </form>


            <table className="category-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.Categoryname}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(category)}>Edit</button>
                                <button className="c-delete-btn" onClick={() => handleDelete(category.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admincategory;
