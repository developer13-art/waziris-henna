import React from 'react'

function RevenueChart({ data = [] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Revenue Overview</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-[#D4AF37] rounded-t-lg"
              style={{ height: `${Math.max(10, (item.revenue / 10000) * 100)}px` }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{item.date?.substring(5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RevenueChart