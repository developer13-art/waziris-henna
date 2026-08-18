import React, { useState } from 'react'

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
    image_url: design?.image_url || '',
    is_featured: design?.is_featured || false,
    is_design_of_week: design?.is_design_of_week || false,
    is_active: design?.is_active ?? true,
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
      <h3 className="font-semibold text-lg">{design ? 'Edit Design' : 'Add Design'}</h3>
      <div>
        <label className="block text-sm font-semibold mb-1">Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl bg-white">
            <option value="">Select</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Style</label>
          <input type="text" name="style" value={formData.style} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Occasion</label>
          <input type="text" name="occasion" value={formData.occasion} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Complexity</label>
          <select name="complexity" value={formData.complexity} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl bg-white">
            <option value="Simple">Simple</option>
            <option value="Medium">Medium</option>
            <option value="Intricate">Intricate</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Image URL</label>
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">
          {design ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-full font-semibold">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default DesignForm