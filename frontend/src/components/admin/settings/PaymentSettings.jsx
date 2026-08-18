import React, { useState } from 'react'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function PaymentSettings() {
  const [formData, setFormData] = useState({
    paystack_public_key: '',
    paystack_secret_key: '',
    delivery_fee: '1500',
    free_delivery_threshold: '20000',
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await api.post(endpoints.settings, { group: 'payment', settings: formData })
      toast.success('Payment settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Paystack Public Key</label>
        <input type="text" name="paystack_public_key" value={formData.paystack_public_key} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Paystack Secret Key</label>
        <input type="password" name="paystack_secret_key" value={formData.paystack_secret_key} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Delivery Fee (₦)</label>
        <input type="number" name="delivery_fee" value={formData.delivery_fee} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Free Delivery Threshold (₦)</label>
        <input type="number" name="free_delivery_threshold" value={formData.free_delivery_threshold} onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
      </div>
      <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">Save</button>
    </form>
  )
}

export default PaymentSettings