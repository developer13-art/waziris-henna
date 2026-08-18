import React from 'react'

function PaymentDetails({ payment }) {
  if (!payment) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Reference</p>
        <p className="font-mono font-semibold text-sm">{payment.payment_reference}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Amount</p>
        <p className="font-bold text-[#8B5E3C]">₦{parseFloat(payment.amount).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Status</p>
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {payment.payment_status}
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-500">Method</p>
        <p className="font-semibold">{payment.payment_method}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Date</p>
        <p className="font-semibold text-sm">{new Date(payment.created_at).toLocaleString()}</p>
      </div>
      {payment.paystack_reference && (
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Paystack Reference</p>
          <p className="font-mono font-semibold text-sm">{payment.paystack_reference}</p>
        </div>
      )}
    </div>
  )
}

export default PaymentDetails