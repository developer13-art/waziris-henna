import React from 'react'
import StatsCards from './StatsCards'
import RecentBookings from './RecentBookings'
import RecentOrders from './RecentOrders'

function DashboardOverview({ stats, recentBookings, recentOrders }) {
  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentBookings bookings={recentBookings} />
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  )
}

export default DashboardOverview