import React from 'react'
import PaymentStatusBadge from './PaymentStatusBadge'

function PaymentsList({ payments, onView }) {
  if (payments.length === 0) {
    return <div className="text-center py-10 text-gray-500">No payments found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono">{payment.payment_reference}</td>
              <td className="px-4 py-3 font-semibold text-sm">₦{parseFloat(payment.amount).toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{payment.payment_method}</td>
              <td className="px-4 py-3"><PaymentStatusBadge status={payment.payment_status} /></td>
              <td className="px-4 py-3 text-sm">{new Date(payment.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button onClick={() => onView(payment.id)} className="px-3 py-1.5 bg-[#8B5E3C] text-white text-xs rounded-lg">
                  <i className="fas fa-eye mr-1"></i> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentsList