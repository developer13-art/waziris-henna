import React, { useState, useEffect } from 'react'
import api, { endpoints } from '../../../services/api'

function BookingReports() {
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const response = await api.get(endpoints.bookingReport)
      setReportData(response.data || [])
    } catch (error) {
      console.error('Error fetching booking report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-[#D4AF37]"></i></div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Bookings</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Confirmed</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Completed</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 text-sm">{row.booking_date}</td>
                <td className="px-4 py-2 text-sm font-semibold">{row.total_bookings}</td>
                <td className="px-4 py-2 text-sm">{row.confirmed}</td>
                <td className="px-4 py-2 text-sm">{row.completed}</td>
                <td className="px-4 py-2 text-sm">{row.cancelled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookingReports