import React, { useState } from 'react'
import ImageUpload from '../../common/ImageUpload'

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    sale_price: product?.sale_price || '',
    stock_quantity: product?.stock_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 5,
    category: product?.category || 'Henna Products',
    image_url: product?.image_url || null,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    }
    
    onSave(cleanedData)
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
        </div>

        {/* Price */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Price (₦) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
        </div>

        {/* Sale Price */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Sale Price (₦)</label>
          <input
            type="number"
            name="sale_price"
            value={formData.sale_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Optional"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
        </div>

        {/* Stock Quantity */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Stock Quantity *</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            min="0"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <option value="Henna Products">Henna Products</option>
            <option value="Oils">Oils</option>
            <option value="Patterns">Patterns</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Low Stock Threshold */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Low Stock Alert</label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            min="1"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe this product..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e8ddd4',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
      </div>

      {/* Image Upload */}
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Product Image</label>
        <ImageUpload
          onUpload={handleImageUpload}
          directory="products"
          currentImage={formData.image_url}
        />
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          Active
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          Featured
        </label>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            background: '#D4AF37',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <i className="fas fa-save mr-2"></i>
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            background: '#f3f4f6',
            color: '#666',
            border: 'none',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm