import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const isOutOfStock = product.stock_quantity === 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="relative block">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            Out of Stock
          </span>
        )}
        {product.sale_price && product.sale_price < product.price && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            Sale
          </span>
        )}
      </Link>
      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-playfair font-semibold text-lg mb-1 hover:text-[#8B5E3C]">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.short_description || product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#8B5E3C] font-bold text-lg">
            ₦{parseFloat(product.sale_price || product.price).toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#8B5E3C] text-white hover:bg-[#6B4423]'
          }`}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard