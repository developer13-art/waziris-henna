import React from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../common/Modal'

function CheckoutModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
      <p className="text-gray-600 mb-6">Proceed to checkout to complete your order.</p>
      <button onClick={() => { onClose(); navigate('/checkout') }}
        className="w-full py-3 bg-[#D4AF37] text-white rounded-full font-semibold">
        Proceed to Checkout
      </button>
    </Modal>
  )
}

export default CheckoutModal