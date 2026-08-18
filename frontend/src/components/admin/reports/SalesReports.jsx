import React, { useState, useEffect } from 'react'
import api, { endpoints } from '../../../services/api'

function SalesReports() {
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const response = await api.get(endpoints.salesReport)
      setReportData(response.data || [])
    } catch (error) {
      console.error('Error fetching sales report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-[#D4AF37]"></i></div>
  }

  const totalRevenue = reportData.reduce((sum, row) => sum + parseFloat(row.total_amount), 0)

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <p className="text-3xl font-bold text-[#8B5E3C]">₦{totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Transactions</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 text-sm">{row.sale_date}</td>
                  <td className="px-4 py-2 text-sm">{row.total_transactions}</td>
                  <td className="px-4 py-2 text-sm font-semibold">₦{parseFloat(row.total_amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalesReports