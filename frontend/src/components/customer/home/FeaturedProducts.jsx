import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../../context/CartContext'

function FeaturedProducts({ products }) {
  const { addToCart } = useCart()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-tag">Shop</span>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#222] mt-3">Premium Products</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:shadow-xl transition-all"
            >
              <Link to={`/products/${product.slug}`}>
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-[#8B5E3C] font-bold mb-3">₦{parseFloat(product.price).toLocaleString()}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-[#8B5E3C] text-white text-sm font-semibold rounded-full hover:bg-[#6B4423] transition-colors"
                >
                  <i className="fas fa-shopping-cart mr-1"></i> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts