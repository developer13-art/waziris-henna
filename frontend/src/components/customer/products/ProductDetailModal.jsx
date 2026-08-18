import React, { useState } from 'react'
import Modal from '../../common/Modal'
import { useCart } from '../../../context/CartContext'

function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={product.image_url} alt={product.name} className="rounded-2xl w-full h-64 object-cover" />
        <div className="space-y-4">
          <h3 className="font-playfair text-2xl font-bold">{product.name}</h3>
          <p className="text-[#8B5E3C] font-bold text-xl">₦{parseFloat(product.price).toLocaleString()}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 bg-gray-100 rounded-full">-</button>
              <span className="font-semibold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 bg-gray-100 rounded-full">+</button>
            </div>
            <button onClick={() => { addToCart(product, quantity); onClose() }}
              className="flex-1 py-3 bg-[#8B5E3C] text-white rounded-full font-semibold">
              <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProductDetailModal