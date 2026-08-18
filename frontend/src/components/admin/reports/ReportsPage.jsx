import React, { useState } from 'react'
import BookingReports from './BookingReports'
import SalesReports from './SalesReports'

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('bookings')

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold ${activeTab === 'bookings' ? 'bg-[#8B5E3C] text-white' : 'bg-white'}`}>
          <i className="fas fa-calendar-check mr-1"></i> Booking Reports
        </button>
        <button onClick={() => setActiveTab('sales')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold ${activeTab === 'sales' ? 'bg-[#8B5E3C] text-white' : 'bg-white'}`}>
          <i className="fas fa-money-bill-wave mr-1"></i> Sales Reports
        </button>
      </div>
      {activeTab === 'bookings' ? <BookingReports /> : <SalesReports />}
    </div>
  )
}

export default ReportsPage