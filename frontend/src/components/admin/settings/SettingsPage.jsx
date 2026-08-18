import React, { useState } from 'react'
import BusinessSettings from './BusinessSettings'
import PaymentSettings from './PaymentSettings'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('business')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold ${activeTab === 'business' ? 'bg-[#8B5E3C] text-white' : 'bg-white'}`}>
          <i className="fas fa-store mr-1"></i> Business
        </button>
        <button onClick={() => setActiveTab('payment')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold ${activeTab === 'payment' ? 'bg-[#8B5E3C] text-white' : 'bg-white'}`}>
          <i className="fas fa-credit-card mr-1"></i> Payment
        </button>
      </div>
      {activeTab === 'business' ? <BusinessSettings /> : <PaymentSettings />}
    </div>
  )
}

export default SettingsPage