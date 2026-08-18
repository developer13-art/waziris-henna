import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../../context/CartContext'

function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-white z-50 overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-playfair text-xl font-semibold">Your Cart</h3>
              <button onClick={onClose} className="text-2xl text-gray-500">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Cart is empty</p>
              ) : (
                items.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">₦{parseFloat(item.price).toLocaleString()} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product_id)} className="text-red-500">
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" onClick={onClose}
                  className="block w-full py-3 bg-[#D4AF37] text-white text-center rounded-full font-semibold">
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer