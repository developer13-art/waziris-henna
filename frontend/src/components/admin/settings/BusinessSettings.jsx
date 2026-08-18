import React, { useState } from 'react'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function BusinessSettings() {
  const [formData, setFormData] = useState({
    business_name: "Waziri's Henna",
    phone: '+2347048823830',
    email: 'aishaabdullahiwaziri001@gmail.com',
    location: 'Kaduna, Nigeria',
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await api.post(endpoints.settings, { group: 'business', settings: formData })
      toast.success('Settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Business Name</label>
        <input type="text" name="business_name" value={formData.business_name} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">Save</button>
    </form>
  )
}

export default BusinessSettings