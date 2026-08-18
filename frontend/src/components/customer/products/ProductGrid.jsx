import React from 'react'
import ProductCard from './ProductCard'
import EmptyState from '../common/EmptyState'

function ProductGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#e8ddd4] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="fa-box-open"
        title="No Products Found"
        description="Check back soon for new products."
        linkTo="/contact"
        linkText="Contact Us"
      />
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid