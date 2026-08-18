import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('business')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.settings)
      setSettings(response.data || {})
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (group, data) => {
    setIsSaving(true)
    try {
      await api.post(endpoints.settings, { group, settings: data })
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !settings) return <Loader />

  const tabs = [
    { id: 'business', label: 'Business Info', icon: 'fa-store' },
    { id: 'payment', label: 'Payment Settings', icon: 'fa-credit-card' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
  ]

  return (
    <>
      <Helmet>
        <title>Settings | Waziri's Henna Admin</title>
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-500">Manage your business settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#8B5E3C] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={`fas ${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        {activeTab === 'business' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Business Information</h3>
            <div>
              <label className="block font-semibold text-sm mb-2">Business Name</label>
              <input
                type="text"
                defaultValue={settings.business_name || "Waziri's Henna"}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Phone Number</label>
              <input
                type="text"
                defaultValue={settings.phone || '+2347048823830'}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Email</label>
              <input
                type="email"
                defaultValue={settings.email || 'aishaabdullahiwaziri001@gmail.com'}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Location</label>
              <input
                type="text"
                defaultValue={settings.location || 'Kaduna, Nigeria'}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              onClick={() => handleSave('business', settings)}
              disabled={isSaving}
              className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Payment Settings</h3>
            <div>
              <label className="block font-semibold text-sm mb-2">Paystack Public Key</label>
              <input
                type="text"
                defaultValue={settings.paystack_public_key || ''}
                placeholder="pk_test_..."
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Paystack Secret Key</label>
              <input
                type="password"
                defaultValue={settings.paystack_secret_key || ''}
                placeholder="sk_test_..."
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Delivery Fee (₦)</label>
              <input
                type="number"
                defaultValue={settings.delivery_fee || '1500'}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-2">Free Delivery Threshold (₦)</label>
              <input
                type="number"
                defaultValue={settings.free_delivery_threshold || '20000'}
                className="w-full px-4 py-3 border-2 border-[#e8ddd4] rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              onClick={() => handleSave('payment', settings)}
              disabled={isSaving}
              className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Notification Settings</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm font-semibold">Email notifications for new bookings</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm font-semibold">WhatsApp notifications for new orders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm font-semibold">Notify on new customer reviews</span>
            </label>
            <button
              onClick={() => handleSave('notifications', settings)}
              disabled={isSaving}
              className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#b8941f] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default AdminSettingsPage