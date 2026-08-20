import React, { useState, useEffect } from 'react'
import ImageUpload from '../../common/ImageUpload'
import api, { endpoints } from '../../../services/api'

function DesignForm({ design, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: design?.title || '',
    description: design?.description || '',
    category_id: design?.category_id || '',
    style: design?.style || '',
    occasion: design?.occasion || '',
    body_area: design?.body_area || '',
    complexity: design?.complexity || 'Medium',
    price: design?.price || '',
    image_url: design?.image_url || null,
    is_featured: design?.is_featured || false,
    is_design_of_week: design?.is_design_of_week || false,
    is_active: design?.is_active ?? true,
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
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      price: formData.price ? parseFloat(formData.price) : null,
    }
    
    onSave(cleanedData)
  }

  // Style options
  const styleOptions = [
    'Traditional Hausa',
    'Arabic',
    'Floral',
    'Minimalist',
    'Geometric',
    'Modern',
    'Classic',
  ]

  // Occasion options
  const occasionOptions = [
    'Wedding',
    'Eid',
    'Birthday',
    'Casual',
    'Naming Ceremony',
    'Engagement',
    'Anniversary',
    'Other',
  ]

  // Body area options
  const bodyAreaOptions = [
    'Hands',
    'Feet',
    'Both',
  ]

  // Complexity options
  const complexityOptions = [
    'Simple',
    'Medium',
    'Intricate',
  ]

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
        {design ? 'Edit Design' : 'Add New Design'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Design Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Royal Hausa Bridal"
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

        {/* Category - DROPDOWN */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Style - DROPDOWN */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Style</label>
          <select
            name="style"
            value={formData.style}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            <option value="">Select Style</option>
            {styleOptions.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Occasion - DROPDOWN */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Occasion</label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            <option value="">Select Occasion</option>
            {occasionOptions.map(occasion => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
        </div>

        {/* Body Area - DROPDOWN */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Body Area</label>
          <select
            name="body_area"
            value={formData.body_area}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            <option value="">Select Body Area</option>
            {bodyAreaOptions.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Complexity - DROPDOWN */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Complexity</label>
          <select
            name="complexity"
            value={formData.complexity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e8ddd4',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer'
            }}
          >
            {complexityOptions.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Price (₦)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
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
      </div>

      {/* Description */}
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe this design..."
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
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Design Image</label>
        <ImageUpload
          onUpload={handleImageUpload}
          directory="designs"
          currentImage={formData.image_url}
        />
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="is_design_of_week"
            checked={formData.is_design_of_week}
            onChange={handleChange}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          Design of Week
        </label>
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
          {design ? 'Update Design' : 'Create Design'}
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

export default DesignForm