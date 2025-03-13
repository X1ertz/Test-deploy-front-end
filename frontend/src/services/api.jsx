import axios from 'axios';


const API_URL = 'https://back-end-e-commerce-p0si.onrender.com';

export const sendDataToBackend = async (data) => {
  console.log('Sending data to backend:', data);
  try {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending data:', error);
    throw error;
  }
};

export const sendDataLogin = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/login`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login request error:', error);
    throw error; 
  }
};


export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchDiscountCodes = async () => {
  try {
    const response = await axios.get(`${API_URL}/discount`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    throw error;
  }
};
export const sendOrderToBackend = async (orderData) => {
  console.log("📌 Sending order data:", JSON.stringify(orderData, null, 2));
  try {
    const response = await axios.post(`${API_URL}/order`, orderData);
    console.log("✅ Order placed successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending order:", error.response?.data || error.message);
    throw error;
  }
};


export const checkDiscountCode = async (code) => {
  try {
    console.log("📌 Checking discount code:", code); // Debug
    const response = await fetch(`${API_URL}/discounts/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code.trim() }),
    });

    const data = await response.json();
    console.log("📌 Discount API Response:", data); // Debug ✅

    if (!response.ok) {
      console.error("❌ Discount Code Error:", data.message);
      alert("⚠️ " + data.message);
    } else {
      alert(`✅ Applied ${data.percentage}% discount`);
      return data;
    }
  } catch (error) {
    console.error("❌ Error checking discount:", error);
    alert("Internal Server Error");
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const saveUser = async (user, editing) => {
  try {
    if (editing) {
      await axios.put(`${API_URL}/users/${user.id}`, user);
    } else {
      await axios.post(API_URL, user);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};
export const addProduct = async (product) => {
  await axios.post(API_URL, product);
};

export const updateProduct = async (id, product) => {
  await axios.put(`${API_URL}/products/${id}`, product);
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
};

export const addCategory = async (category) => {
  return fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
  });
};

export const updateCategory = async (id, category) => {
  return fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
  });
};

export const deleteCategory = async (id) => {
  return fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;  
  }
};
export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${API_URL}/orders/${id}`);
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error; 
  }
};
export const createOrder = async (orderData) => {
  try {
      const response = await axios.post(`${API_URL}/admin/order`, orderData, {
        headers: {
          'Content-Type': 'multipart/form-data',
      },
      });
      return response.data;
  } catch (error) {
      console.error('Error creating order:', error);
      throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
  }
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

export const updateOrder = async (orderId, orderData) => {
  const response = await axios.put(`${API_URL}/orders/${orderId}`, orderData);
  return response.data;
};

export const deleteOrderItem = async (orderId, itemId) => {
  await axios.delete(`${API_URL}/orders/${orderId}/item/${itemId}`);
};
export const updateOrderItemQuantity = async (orderId, productId, data) => {
  try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/items/${productId}`, data);
      return response.data;
  } catch (error) {
      console.error('Error updating order item quantity:', error.response?.data || error.message);
      throw error;
  }
};
export const getDiscountById = async(discountId)=>{
  const response = await axios.get(`${API_URL}/discount/${discountId}`);
  return response.data
}


export const addProductToOrder = async (orderId, productData) => {
  try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/add-product`, productData);
      return response.data;  
  } catch (error) {
      console.error('Error adding product:', error);
      throw error;  
  }
};

export const updateStockForProduct = async (productId, stockData, size) => {
  try {
      const response = await fetch(`${API_URL}/products/${productId}/update-stock`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...stockData, size }), 
      });

      if (!response.ok) {
          throw new Error('Failed to update stock');
      }

      return await response.json();
  } catch (error) {
      console.error('Error updating stock:', error);
  }
};
export const getDiscounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/discount`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts", error);
    throw error;
  }
};

export const deleteDiscount = async (id) => {
  try {
    await axios.delete(`${API_URL}/discount/${id}`);
  } catch (error) {
    console.error("Error deleting discount", error);
    throw error;
  }
};

export const updateDiscount = async (id, data) => {
  try {
    await axios.put(`${API_URL}/discount/${id}`, data);
  } catch (error) {
    console.error("Error updating discount", error);
    throw error;
  }
};

export const createDiscount = async (data) => {
  try {
    await axios.post(`${API_URL}/discount`, data);
  } catch (error) {
    console.error("Error creating discount", error);
    throw error;
  }
};
export const getUsedDiscounts = async () => {
  try {
    const response = await axios.get(`${API_URL}/used-discounts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching used discounts", error);
    throw error; 
  }
};
export const deleteUsedDiscount = async (id) => {
  try {
    await axios.delete(`${API_URL}/used-discounts/${id}`);
  } catch (error) {
    console.error("Error deleting used discount", error);
    throw error; 
  }
};
export const updateUsedDiscount = async (id, data) => {
  try {
    console.log("Sending data to API:", data);
    await axios.put(`${API_URL}/used-discount/${id}`, data);
  } catch (error) {
    console.error("Error updating used discount", error);
    throw error;
  }
};
export const addUsedDiscount = async (data) => {
  try {
    await axios.post(`${API_URL}/used-discount`, data);
  } catch (error) {
    console.error("Error adding used discount", error);
    throw error;
  }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    await axios.put(`${API_URL}/users/${userId}/password`, {
      oldPassword,
      newPassword,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`)
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Could not fetch orders');
  }
};
export const reports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Could not fetch orders");
  }
};