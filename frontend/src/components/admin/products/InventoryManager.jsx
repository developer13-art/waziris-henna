import React, { useState } from 'react'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function InventoryManager({ product, onClose }) {
  const [quantity, setQuantity] = useState(0)
  const [changeType, setChangeType] = useState('add')
  const [reason, setReason] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(endpoints.productInventory(product.id), {
        change_type: changeType,
        quantity_changed: quantity,
        reason: reason || 'Manual adjustment',
      })
      toast.success('Inventory updated')
      onClose()
    } catch (error) {
      toast.error('Failed to update inventory')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="font-semibold mb-4">Adjust Inventory: {product.name}</h3>
      <p className="text-sm text-gray-500 mb-4">Current stock: <span className="font-bold">{product.stock_quantity}</span></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Change Type</label>
          <select value={changeType} onChange={(e) => setChangeType(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl bg-white">
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
            <option value="adjust">Set Exact Quantity</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} min="0"
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Reason</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., New shipment"
            className="w-full px-4 py-2 border-2 border-[#e8ddd4] rounded-xl" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-semibold">Update</button>
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-full font-semibold">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default InventoryManager