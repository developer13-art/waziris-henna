import React, { useState } from 'react'

function ServiceForm({ service, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    starting_price: service?.starting_price || '',
    duration_minutes: service?.duration_minutes || 60,
    is_active: service?.is_active ?? true,
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
      <h3 className="font-semibold text-lg">{service ? 'Edit Service' : 'Add Service'}</h3>
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
          <label className="block text-sm font-semibold mb-1">Starting Price (₦)</label>
          <input type="number" name="starting_price" value={formData.starting_price} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Duration (mins)</label>
          <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">
          {service ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-full font-semibold">Cancel</button>
      </div>
    </form>
  )
}

export default ServiceForm