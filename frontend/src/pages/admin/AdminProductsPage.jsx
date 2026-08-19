import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import api, { endpoints } from '../../services/api'
import ProductForm from '../../components/admin/products/ProductForm'
import InventoryManager from '../../components/admin/products/InventoryManager'
import { getImageUrl } from '../../utils/imageUrl'
import { toast } from 'react-toastify'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showInventory, setShowInventory] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoints.products, { params: { per_page: 100 } })
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(endpoints.productDetail(editingProduct.id), formData)
        toast.success('Product updated successfully')
      } else {
        await api.post(endpoints.products, formData)
        toast.success('Product created successfully')
      }
      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
    setShowInventory(false)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(endpoints.productDetail(productId))
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Failed to delete product')
      }
    }
  }

  const handleInventory = (product) => {
    setSelectedProduct(product)
    setShowInventory(true)
    setShowForm(false)
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | Waziri's Henna Admin</title>
      </Helmet>

      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Products Management</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage your henna products and inventory</p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); setShowInventory(false) }}
            style={{
              padding: '10px 20px',
              background: '#D4AF37',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Product
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingProduct(null) }}
          />
        )}

        {/* Inventory Manager */}
        {showInventory && selectedProduct && (
          <InventoryManager
            product={selectedProduct}
            onClose={() => { 
              setShowInventory(false); 
              setSelectedProduct(null); 
              fetchProducts() 
            }}
          />
        )}

        {/* Products Grid */}
        {!showForm && !showInventory && (
          <>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D4AF37' }}></i>
                <p style={{ color: '#666', marginTop: '12px' }}>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-box" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>No Products Yet</p>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
                  Click "Add Product" to create your first product
                </p>
                <button
                  onClick={() => { setEditingProduct(null); setShowForm(true) }}
                  style={{
                    padding: '12px 24px',
                    background: '#D4AF37',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <i className="fas fa-plus mr-2"></i> Add Product
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {/* Image */}
                    {product.image_url ? (
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : null}
                    {/* Placeholder */}
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: '#f9fafb',
                      display: product.image_url ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-image" style={{ fontSize: '40px', color: '#ddd' }}></i>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{product.name}</h3>
                      <p style={{ fontSize: '14px', color: '#8B5E3C', fontWeight: '700', marginBottom: '8px' }}>
                        ₦{parseFloat(product.price || 0).toLocaleString()}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: product.stock_quantity === 0 ? '#ef4444' : product.stock_quantity <= (product.low_stock_threshold || 5) ? '#f59e0b' : '#10b981',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        {product.stock_quantity === 0 
                          ? 'Out of Stock' 
                          : product.stock_quantity <= (product.low_stock_threshold || 5) 
                            ? `Low Stock: ${product.stock_quantity}` 
                            : `In Stock: ${product.stock_quantity}`}
                      </p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#8B5E3C',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleInventory(product)}
                          style={{
                            padding: '8px 10px',
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                          title="Manage Inventory"
                        >
                          <i className="fas fa-boxes"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            padding: '8px 10px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminProductsPage