import React, { useState, useEffect } from 'react'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'
import InventoryManager from './InventoryManager'
import api, { endpoints } from '../../../services/api'
import { toast } from 'react-toastify'

function ProductManager() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showInventory, setShowInventory] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.products, { params: { per_page: 100 } })
      setProducts(response.data || [])
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setEditingProduct(null); setShowForm(true) }}
          className="px-4 py-2 bg-[#D4AF37] text-white rounded-full font-semibold text-sm">
          <i className="fas fa-plus mr-1"></i> Add Product
        </button>
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={async (formData) => {
            try {
              if (editingProduct) {
                await api.put(endpoints.productDetail(editingProduct.id), formData)
              } else {
                await api.post(endpoints.products, formData)
              }
              toast.success('Product saved')
              setShowForm(false)
              fetchProducts()
            } catch (error) {
              toast.error('Failed to save product')
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {showInventory && selectedProduct && (
        <InventoryManager product={selectedProduct} onClose={() => setShowInventory(false)} />
      )}
      {!showForm && !showInventory && (
        <ProductTable
          products={products}
          isLoading={isLoading}
          onEdit={(product) => { setEditingProduct(product); setShowForm(true) }}
          onInventory={(product) => { setSelectedProduct(product); setShowInventory(true) }}
          onDelete={async (id) => {
            if (window.confirm('Delete this product?')) {
              await api.delete(endpoints.productDetail(id))
              toast.success('Product deleted')
              fetchProducts()
            }
          }}
        />
      )}
    </div>
  )
}

export default ProductManager