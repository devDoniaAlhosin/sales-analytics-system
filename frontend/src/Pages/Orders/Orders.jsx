import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';
import orderService from '../../services/api/orderService';
import OrderForm from '../../Components/OrderForm/OrderForm';
import '../../Styles/pages/Orders.scss';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    price: '',
    quantity: '',
    date: new Date().toISOString().slice(0, 16)
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    priceFrom: '',
    priceTo: '',
  });

  // Format date from UTC to local datetime
  const formatDateToLocal = (utcDate) => {
    try {
      const date = parseISO(utcDate);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format date for display
  const formatDateForDisplay = (utcDate) => {
    try {
      const date = parseISO(utcDate);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return 'Invalid Date';
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch orders. Please try again later.',
      });
      setOrders([]);
      setFilteredOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(order => 
        order.product_name.toLowerCase().includes(searchLower) ||
        order.id.toString().includes(searchLower) ||
        order.product_id.toString().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter(order => 
        new Date(order.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      result = result.filter(order => 
        new Date(order.date) <= new Date(filters.dateTo)
      );
    }

    // Price range filter
    if (filters.priceFrom) {
      result = result.filter(order => 
        order.price >= parseFloat(filters.priceFrom)
      );
    }
    if (filters.priceTo) {
      result = result.filter(order => 
        order.price <= parseFloat(filters.priceTo)
      );
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      priceFrom: '',
      priceTo: '',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      if (formData.id) {
        const updatedOrder = await orderService.updateOrder(formData.id, orderData);
        setOrders(orders.map(order => 
          order.id === formData.id ? updatedOrder : order
        ));
        Swal.fire('Success!', 'Order updated successfully.', 'success');
      } else {
        const newOrder = await orderService.createOrder(orderData);
        setOrders([...orders, newOrder]);
        Swal.fire('Success!', 'Order created successfully.', 'success');
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
      Swal.fire('Error!', 'Failed to save order.', 'error');
    }
  };

  // Delete order
  const handleDelete = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await orderService.deleteOrder(orderId);
        setOrders(orders.filter(order => order.id !== orderId));
        Swal.fire('Deleted!', 'Order has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      Swal.fire('Error!', 'Failed to delete order.', 'error');
    }
  };

  // Edit order
  const handleEdit = (order) => {
    const formattedOrder = {
      ...order,
      date: formatDateToLocal(order.date)
    };
    setFormData(formattedOrder);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      product_id: '',
      product_name: '',
      price: '',
      quantity: '',
      date: new Date().toISOString().slice(0, 16)
    });
  };

  // Add new order
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders Management</h2>
        <button className="btn-add" onClick={handleAddNew}>
          Add New Order
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            placeholder="Search by product name, ID..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <label>Date From:</label>
            <input
              type="datetime-local"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <label>Date To:</label>
            <input
              type="datetime-local"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <label>Price From:</label>
            <input
              type="number"
              name="priceFrom"
              placeholder="Min price"
              value={filters.priceFrom}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className="filter-item">
            <label>Price To:</label>
            <input
              type="number"
              name="priceTo"
              placeholder="Max price"
              value={filters.priceTo}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
            />
          </div>
          <button className="btn-reset" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Order Form Modal */}
      {showForm && (
        <OrderForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCancel={() => {
            setShowForm(false);
            resetForm();
          }}
          isEditing={!!formData.id}
        />
      )}

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product_id}</td>
                  <td>{order.product_name}</td>
                  <td>${order.price}</td>
                  <td>{order.quantity}</td>
                  <td>{formatDateForDisplay(order.date)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders; 