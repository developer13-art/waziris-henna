import React, { useState } from 'react'

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    sale_price: product?.sale_price || '',
    stock_quantity: product?.stock_quantity || 0,
    category: product?.category || 'Henna Products',
    image_url: product?.image_url || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mb-6">
      <h3 className="font-semibold text-lg">{product ? 'Edit Product' : 'Add Product'}</h3>
      <div>
        <label className="block text-sm font-semibold mb-1">Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Price (₦) *</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Stock Quantity</label>
          <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Image URL</label>
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">
          {product ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-full font-semibold">Cancel</button>
      </div>
    </form>
  )
}

export default ProductForm