import React from 'react'

function ProductTable({ products, isLoading, onEdit, onInventory, onDelete }) {
  if (isLoading) {
    return <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-2xl text-[#D4AF37]"></i></div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2">
                <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
              </td>
              <td className="px-4 py-2 font-semibold text-sm">{product.name}</td>
              <td className="px-4 py-2 text-sm">₦{parseFloat(product.price).toLocaleString()}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                  product.stock_quantity <= product.low_stock_threshold ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {product.stock_quantity}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(product)} className="px-3 py-1 bg-[#8B5E3C] text-white text-xs rounded-lg">Edit</button>
                  <button onClick={() => onInventory(product)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">Stock</button>
                  <button onClick={() => onDelete(product.id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable