import React, { useEffect, useState } from "react";
import { getDiscounts, deleteDiscount, updateDiscount, createDiscount, getUsedDiscounts, deleteUsedDiscount, updateUsedDiscount,addUsedDiscount } from "../services/api";
import "../asset/css/discount.css";
import { useNavigate } from 'react-router-dom';
const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [usedDiscounts, setUsedDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingUsedDiscount, setEditingUsedDiscount] = useState(null);
  const [formData, setFormData] = useState({ discount_name: "", percentage: "", userid: "", discountcode: "" });
  const [isUsedDiscountModalOpen, setIsUsedDiscountModalOpen] = useState(false);


  useEffect(() => {
    fetchDiscounts();
    fetchUsedDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts", error);
    }
    setLoading(false);
  };

  const handleAddUsedDiscount = () => {
    setEditingUsedDiscount(null);
    setFormData({ userid: "", discountcode: "" });
    setIsUsedDiscountModalOpen(true);
  };

  const fetchUsedDiscounts = async () => {
    setLoading(true);
    try {
      const data = await getUsedDiscounts();
      setUsedDiscounts(data);
    } catch (error) {
      console.error("Error fetching used discounts", error);
    }
    setLoading(false);
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await deleteDiscount(id);
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount", error);
    }
  };

  const handleEditUsedDiscount = (record) => {
    setEditingUsedDiscount(record);
    setFormData({
      userid: record.userid,
      discountcode: record.discountcode,
    });
    setIsUsedDiscountModalOpen(true);
    setIsModalOpen(false);
  };
  const handleUsedDiscountFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      if (editingUsedDiscount) {
        await updateUsedDiscount(editingUsedDiscount.id, formData);
      } else {
        await addUsedDiscount(formData);
      }
      fetchUsedDiscounts();
      setIsUsedDiscountModalOpen(false);
    } catch (error) {
      console.error("Error saving used discount", error);
    }
  };


  const handleDeleteUsedDiscount = async (id) => {
    try {
      await deleteUsedDiscount(id);
      fetchUsedDiscounts();
    } catch (error) {
      console.error("Error deleting used discount", error);
    }
  };

  const handleEditDiscount = (record) => {
    setEditingDiscount(record);
    setFormData({
      discount_name: record.discount_name,
      percentage: record.percentage,
    });
    setIsModalOpen(true);
    setIsUsedDiscountModalOpen(false);
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setFormData({ discount_name: "", percentage: "" });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, formData);
      } else {
        await createDiscount(formData);
      }
      fetchDiscounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving discount", error);
    }
  };

  return (
    <>
    <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
    <div className="discount-management-container">
      <h2 className="discount-management-header">Discount Management</h2>
      <button className="add-discount-btn" onClick={handleAddDiscount}>Add Discount</button>

      <h3 className="discount-list-header">Discounts</h3>
      <table className="discount-list-table">
        <thead>
          <tr>
            <th className="discount-id-header">ID</th>
            <th className="discount-name-header">Name</th>
            <th className="discount-percentage-header">Percentage</th>
            <th className="discount-used-header">Used</th>
            <th className="discount-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td className="discount-id">{discount.id}</td>
              <td className="discount-name">{discount.discount_name}</td>
              <td className="discount-percentage">{discount.percentage}%</td>
              <td className="discount-usage">{discount.usageCount ? discount.usageCount : 0}</td>
              <td className="discount-actions">
                <button className="edit-discount-btn" onClick={() => handleEditDiscount(discount)}>Edit</button>
                <button className="delete-discount-btn" onClick={() => handleDeleteDiscount(discount.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="used-discount-list-header">Used Discounts</h3>
      <button className="add-used-discount-btn" onClick={handleAddUsedDiscount}>Add Used Discount</button>
      <table className="used-discount-list-table">
        <thead>
          <tr>
            <th className="used-discount-id-header">ID</th>
            <th className="used-discount-userid-header">User ID</th>
            <th className="used-discount-code-header">Discount Code</th>
            <th className="used-discount-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usedDiscounts.map((usedDiscount) => (
            <tr key={usedDiscount.id}>
              <td className="used-discount-id">{usedDiscount.id}</td>
              <td className="used-discount-userid">{usedDiscount.userid}</td>
              <td className="used-discount-code">{usedDiscount.discountcode}</td>
              <td className="used-discount-actions">
                <button className="edit-used-discount-btn" onClick={() => handleEditUsedDiscount(usedDiscount)}>Edit</button>
                <button className="delete-used-discount-btn" onClick={() => handleDeleteUsedDiscount(usedDiscount.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="discount-modal">
          <h3>{editingDiscount ? "Edit Discount" : "Add Discount"}</h3>
          <form onSubmit={handleFormSubmit}>
            <label className="modal-label">
              Discount Name:
              <input
                className="modal-input"
                type="text"
                name="discount_name"
                value={formData.discount_name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label className="modal-label">
              Percentage:
              <input
                className="modal-input"
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <button type="submit" className="modal-save-btn">Save</button>
            <button type="button" className="modal-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}

      {isUsedDiscountModalOpen && (
        <div className="used-discount-modal">
          <h3>{editingUsedDiscount ? "Edit Used Discount" : "Add Used Discount"}</h3>
          <form onSubmit={handleUsedDiscountFormSubmit}>
            <label className="modal-label">
              User ID:
              <input
                className="modal-input"
                type="number"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label className="modal-label">
              Discount Code:
              <input
                className="modal-input"
                type="text"
                name="discountcode"
                value={formData.discountcode}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <button type="submit" className="modal-save-btn">Save</button>
            <button type="button" className="modal-cancel-btn" onClick={() => setIsUsedDiscountModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>

    </>
  );
};

export default Discount;

