import React from 'react';
import '../../Styles/components/OrderForm.scss';

const OrderForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  handleCancel, 
  isEditing = false 
}) => {
  return (
    <div className="order-form-modal">
      <div className="order-form-content">
        <h3>{isEditing ? 'Edit Order' : 'Add New Order'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product ID:</label>
            <input
              type="number"
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date ? formData.date.slice(0, 16) : ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {isEditing ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm; 